"use strict"

/*
  This script uses the Web Serial API. As of writing, this is only supported in
  chromium based web browsers. It will _not_ work in Safari or Firefox.
  See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

  - Love Lagerkvist, 220114, Malmö Universitet
*/

if (!("serial" in navigator)) {
  // The Web Serial API is not supported.
  console.log("Your browser does not support Web Serial, try using something Chromium based.")
  while (true);
}

navigator.serial.addEventListener('connect', (event) => {
  // Connect to `e.target` or add it to a list of available ports.
  console.log("Connect");
  console.dir(event);
  console.log(event.target);
});

navigator.serial.addEventListener('disconnect', (event) => {
  // Remove `e.target` from the list of available ports.
  console.log("Disconnect");
  console.dir(event);
  console.log(event.target);
});


navigator.serial.getPorts().then((ports) => {
  // Initialize the list of available ports with `ports` on page load.
  console.log(ports);
});


