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
