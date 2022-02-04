"use strict"

/*
  This script communicates bidirectionally with an Arduino through JSON.
  It appears quite a bit more complicated than what we have seen before,
  but it is really just a combination of the two previous Arduino exercises.

  The scirpt assumes that you are storing all your application state in a global
  object called `state`. This could be confusing if you are trying to make changes
  or appropriate the code without keeping this in mind.

  This script uses the Web Serial API. As of writing, this is only supported in
  chromium based web browsers. It will _not_ work in Safari or Firefox.
  See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

  - Love Lagerkvist, 220117, Malmö Universitet
*/

if (!("serial" in navigator)) {
  alert("Your browser does not support Web Serial, try using something Chromium based.")
}


const requestPortButton = document.querySelector("#request-port-access");
requestPortButton.addEventListener("pointerdown", async (event) => { // note that this is an async function!
  // First, request port access, which hopefully leads to a connection that we can keep around in the state
  state.serial = await navigator.serial.requestPort(); 

  // Then, open communications to is with the correct baudRate. This _has_ to be the same in both the Arduino sketch and on the website!
  await state.serial.open({ baudRate: 9600 }); 

  document.querySelector("#connection-status").innerHTML = "Arduino is connected!";

  // We start the reader function, an async loop that gets data from serial (if any) and then calls the callback
  readJSONFromArduino(async () => {
    updateDataDisplay();
    if (state.joystick.pressed) {
      writeJoystickBrightnessToArduino();
    }
  });
});


// This function reads data from the Arduino and calls the callback, if any.
const readJSONFromArduino = async (callback) => {
  if (!state.serial) throw new Error("No Arduino connected to read the data from!");

  // This part is a bit more complex, but you can safely "hand wave it".
  // I explain it in some depth in the demo.
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = state.serial.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  let lineBuffer = "";

  // Listen to data coming from the serial device.
  while (state.serial.readable) {
    const response = await reader.read();

    if (response.done) {
      reader.releaseLock();
      break;
    }

    // Again, a bit more complex. We have to manully handle the response
    // from the Arduino. See the demo.
    lineBuffer += response.value;
    const lines = lineBuffer.split("\n");
    if (lines.length > 1) {                   // We have a complete JSON response!
      lineBuffer = lines.pop();               // Set the buffer to any data from the next response
      const line = lines.pop().trim();        // Get the JSON and remove the newline
      state.joystick = JSON.parse(line);      // Parse the JSON and put it in the state under joystick
      if (callback) callback();               // Run the callback function, if any
    }
  }
}


// Write to the Arduino and run the callback, if any
const writeJSONToArduino = async (callback) => {
  if (!state.serial) throw new Error("No Arduino connected to write the data to!");

  const data = state.dataToWrite; // First, we get the object an object and turn it into JSON.
  const json = JSON.stringify(data); // Transform our internal JS object into JSON representation, which we store as a string

  // The serial writer will want the data in a specific format, which we can do with the TextEncoder object, see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
  const payload = new TextEncoder().encode(json);

  // Get the writer, write to it and then release it for the next write
  const writer = await state.serial.writable.getWriter();
  await writer.write(payload);
  writer.releaseLock();

  if (callback) callback(); // Run the callback function, if any
}


// Take the joystick data, map it to the LEDs range and and shuffle it over to the writer
const writeJoystickBrightnessToArduino = async () => {
  const brightnessFromBothAxies = state.joystick.x + state.joystick.y;
  state.dataToWrite.brightness = mapRange(brightnessFromBothAxies, // Combine both the X & Y axis
                                          0, 2048, // From
                                          0, 255); // To
  writeJSONToArduino();
}


// Simple monitoring
const updateDataDisplay = () => {
  document.querySelector("#joystick-x").innerHTML       = state.joystick.x;
  document.querySelector("#joystick-y").innerHTML       = state.joystick.y;
  document.querySelector("#joystick-pressed").innerHTML = state.joystick.pressed;
}


// This is the same as the Arduino function `map`, a name that is already occupied in JS by something completely different (would you have guessed)
const mapRange = (value, fromLow, fromHigh, toLow, toHigh) => {
  return toLow + (toHigh - toLow) * (value - fromLow) / (fromHigh - fromLow);
}


const updateCanvas = () => {
  ctx.clearRect(0, 0, 512, 512); // Clear the screen

  if (state.joystick.x) {
    const x = mapRange(state.joystick.x, 0, 1024, 0, 512);
    const y = mapRange(state.joystick.y, 0, 1024, 0, 512);

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";

    if (state.joystick.pressed) {
      ctx.fillStyle = "rebeccapurple";
    } else {
      ctx.fillStyle = "gray";
    }

    ctx.fill();
  }

  window.requestAnimationFrame(updateCanvas);
}


const brightnessSlider = document.querySelector("#brightness-slider");
brightnessSlider.addEventListener("input", (event) => {
  if (!state.joystick.pressed) {
    const brightness = event.target.value;
    state.dataToWrite.brightness = parseInt(brightness);
    writeJSONToArduino();
  }
});


const canvas = document.querySelector("#joystick-canvas");
const ctx = canvas.getContext("2d");


const state = {
  dataToWrite: {
    brightness: 0,
  },
  serial: null,
  joystick: {
    x: 0,
    y: 0,
    pressed: false,
  },
}


window.requestAnimationFrame(updateCanvas); // start the canvas animation
