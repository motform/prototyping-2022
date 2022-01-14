/*
  A sketch that communicates to an LED 

  This code assumes you have version 16.19.1 of ArduinoJson.
  It should work with most 6.x versions, but that is guaranteed. 

  — Love Lagerkvist, 210114
     Malmö Universitet
*/

#include <ArduinoJson.h>

// Initializing LED Pin
const byte LED_PIN = 6;

// The brightness of our LED
int brightness = 0;

void setup() {
    // Declaring the digital LED pin as output
    // For more inforamation o this, see
    // https://docs.arduino.cc/learn/microcontrollers/digital-pins
    pinMode(LED_PIN, OUTPUT);

    // Setup the serial
    Serial.begin(9600);

    // Wait for serial port to be initalised
    while (!Serial) continue;
}

void readJson() {
    /* Use https://arduinojson.org/v6/assistant/ to get size of buffer
       Here we assume the JSON { "brightness": {0-255} } */
    StaticJsonDocument<32> jsonInput;

    // We can read directly from Serial using ArduinoJson!
    DeserializationError jsonError = deserializeJson(jsonInput, Serial);

    if (jsonError) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(jsonError.f_str());
        return;
    }

    // deserializeJson puts the deserialized json back into the variable
    // `jsonInput`, after which we can extract values at will.
    brightness = jsonInput["brightness"];
}

void loop() {
    readJson();
    analogWrite(LED_PIN, brightness);
}
