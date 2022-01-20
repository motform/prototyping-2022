"use strict"

/*
  This script communicates unidirectionally with an Arduino through JSON.
  It assumes the Arduino to be flashed with `pwd_led_json`, providing a PWM LED on D6.
  We talk to the Arduino async using the Web Serial API, storing the appliaction
  data in a global object called `state`.

  This script uses the Web Serial API. As of writing, this is only supported in
  chromium based web browsers. It will _not_ work in Safari or Firefox.
  See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

  - Love Lagerkvist, 220114, Malmö Universitet
*/

if (!("serial" in navigator)) {
  // The Web Serial API is not supported.
  alert("Your browser does not support Web Serial, try using something Chromium based.")
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
});


const brightnessSlider = document.querySelector("#brightness-slider");
brightnessSlider.addEventListener("input", (event) => { // NOTE: input vs change
  const brightness = event.target.value;
  state.dataToWrite.brightness = parseInt(brightness);
  writeJSONToArduino("dataToWrite");
});


// Try to write the currently set brightness to the Arduino
const writeJSONToArduino = async (propertyName, callback) => {
  if (!state.serial) throw new Error("No Arduino connected to write the data to!");

  const data = state[propertyName]; // First, we get the object an object and turn it into JSON.
  const json = JSON.stringify(data, null, 0); // Transform our internal JS object into JSON representation, which we store as a string

  // The serial writer will want the data in a specific format, which we can do with the TextEncoder object, see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
  const payload = new TextEncoder().encode(json);

  const writer = await state.serial.writable.getWriter();
  await writer.write(payload);
  writer.releaseLock();

  if (callback) {
    callback();
  }
}


const state = {
  dataToWrite: {
    brightness: 0,
  },
  serial: null,
}
