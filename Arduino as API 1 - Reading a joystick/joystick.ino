/*
  Code originally by Clint Heyer, 2018
  See: https://github.com/ClintH/interactivity/tree/master/joystick/json for information
*/

#include <ArduinoJson.h>

const byte PIN_X = 0;
const byte PIN_Y = 1;
const byte PIN_SWITCH = 3;

void setup() {
    // Need to set up digital PIN_ as an input (unnecessary for analog)
    pinMode(PIN_SWITCH, INPUT_PULLUP);

    // Setup serial
    Serial.begin(9600);

    // Wait for serial port to be initalised
    while (!Serial) continue;
}

void loop() {
    // Read data
    int x = analogRead(PIN_X);
    int y = analogRead(PIN_Y);
    bool pressed = digitalRead(PIN_SWITCH) == LOW;

    // Allocate memory for what we're going to send
    // 61 was calculated via: https://arduinojson.org/v5/assistant/
    // This part is rather complex, but we don't need to understand all the details
    // See the material for Arduino I - reading data for more information
    StaticJsonBuffer<61> jsonBuffer;

    // Construct the JSON, make a JSON-object & add the properties
    JsonObject& root = jsonBuffer.createObject();
    root["x"] = x;
    root["y"] = y;
    root["pressed"] = pressed;

    // Send on the JSON to the serial, along with a new line
    root.printTo(Serial);
    Serial.println();
}
