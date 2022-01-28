"use strict"

/*
  This script communicates unidirectionally with an Arduino through JSON.

  This script uses the Web Serial API. As of writing, this is only supported in
  chromium based web browsers. It will _not_ work in Safari or Firefox.
  See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

  - Love Lagerkvist, 220114, Malmö Universitet
*/

if (!("serial" in navigator)) {
  // The Web Serial API is not supported.
  alert("Your browser does not support Web Serial, try using something Chromium based.")
}


const updateDataDisplay = () => {
  document.querySelector("#joystick-x").innerHTML       = state.joystick.x;
  document.querySelector("#joystick-y").innerHTML       = state.joystick.y;
  document.querySelector("#joystick-pressed").innerHTML = state.joystick.pressed;
}

const requestPortButton = document.querySelector("#request-port-access");
requestPortButton.addEventListener("pointerdown", async (event) => {
  // First, request port access, which hopefully leads to a connection
  const port = await navigator.serial.requestPort(); 
  state.serial = port;
  document.querySelector("#connection-status").innerHTML = "Arduino is connected!";

  // Then, open communications to is with the correct baudRate. This _has_ to be the same in both the Arduino sketch and on the website!
  await state.serial.open({ baudRate: 9600 }); 
  
  // Next, we need to open a "writer", a stream that we can pour data into.
  console.log("Connected to Arduino and updated state:")
  console.log(state);
  await readJSONFromArduino("joystick", updateDataDisplay);
});


// This function will read data from the Arduino
const readJSONFromArduino = async (propertyName, callback) => {
  if (!state.serial) throw new Error("No Arduino connected to read the data from!");

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = state.serial.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  let lineBuffer = "";

  // Listen to data coming from the serial device.
  while (true) {
    const response = await reader.read();

    if (response.done) {
      reader.releaseLock();
      break;
    }

    lineBuffer += response.value;
    const lines = lineBuffer.split("\n");
    if (lines.length > 1) {
      lineBuffer = lines.pop();
      const line = lines.pop().trim();
      const json = JSON.parse(line);
      state[propertyName] = json;
      callback(json);
    }
  }
}

const state = {
  serial: null,
  joystick: {
    x: 0,
    y: 0,
    pressed: false,
  }
}
