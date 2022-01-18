/*
  A sketch that dynamically sets the brightness of a PWN LED
  by communication to a JS application over Web Serial and JSON.
  
  You want to have the PWM LED connected to D6 on your board, 
  like: https://hackster.imgix.net/uploads/attachments/692290/arduino_pwm_k3R9OhQ9qE.png?auto=compress%2Cformat&w=680&h=510&fit=max

  This code assumes you have version 16.19.1 of ArduinoJson.
  It should work with most 6.x versions, but that is guaranteed. 

  — Love Lagerkvist, 220114
  Malmö Universitet
*/

#include <ArduinoJson.h>

// Initializing LED Pin
const byte LED_PIN = 6;

// The brightness of our LED
int LEDBrightness = 0;

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
    LEDBrightness = jsonInput["brightness"];
}

void loop() {
    readJson();
    analogWrite(LED_PIN, LEDBrightness);
}
