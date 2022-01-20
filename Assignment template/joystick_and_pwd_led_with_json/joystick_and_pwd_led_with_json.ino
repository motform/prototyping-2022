/*
  - Love Lagerkvist, 220117, Malmö University
*/

#include <ArduinoJson.h>

// Joystick pins
const byte JOYSTICK_PIN_X = A0;
const byte JOYSTICK_PIN_Y = A2;
const byte JOYSTICK_PIN_BUTTON = 2;

// Joystick variables
int joystickRawX = 0;
int joystickRawY = 0;
int joystickMappedX = 0;
int joystickMappedY = 0;
bool joystickPressed = 0;

// LED pins
const byte LED_PIN = 6;

// LED variables
int LEDBrightness = 0;

void setup() {
    pinMode(JOYSTICK_PIN_X, INPUT);
    pinMode(JOYSTICK_PIN_Y, INPUT);
    pinMode(JOYSTICK_PIN_BUTTON, INPUT_PULLUP);

    pinMode(LED_PIN, OUTPUT);

    Serial.begin(9600); 
    while (!Serial) continue;
}

void updateJoystick() {
    // read the raw values from the joystick's axis
    joystickRawX = analogRead(JOYSTICK_PIN_X);
    joystickRawY = analogRead(JOYSTICK_PIN_Y);

    // `map` the values to fit to a range that makes more logical sense
    joystickMappedX = map(joystickRawX, 0, 1023, -512, 512);
    joystickMappedY = map(joystickRawY, 0, 1023, -512, 512);

    // The button reads 1 when not pressed and 0 when pressed This is a bit confusing, so we compare it to LOW to effectievly flip the bit. I.e., if the button is pressed we turn a 0 into 1, or logical true.
    joystickPressed = digitalRead(JOYSTICK_PIN_BUTTON) == LOW;  
}

void sendJoystickJSON() {
    StaticJsonDocument<56> json;

    json["x"] = joystickMappedX;
    json["y"] = joystickMappedY;
    json["pressed"] = joystickPressed;

    // We can write directly to Serial using ArduinoJson!
    serializeJson(json, Serial);
    Serial.println();
}


void readLEDJSON() {
    /* Use https://arduinojson.org/v6/assistant/ to get size of buffer
       Here we assume the JSON { "brightness": {0-255} } */
    StaticJsonDocument<32> jsonInput;

    // We can read directly from Serial using ArduinoJson!
    deserializeJson(jsonInput, Serial); // we don't use the jsonError 

    // DeserializeJson puts the deserialized json back into the variable `jsonInput`, after which we can extract values at will.
    LEDBrightness = jsonInput["brightness"];
}


void updateLED() {
    analogWrite(LED_PIN, LEDBrightness);
}

void loop() {
    updateJoystick();
    sendJoystickJSON();
    readLEDJSON();
    updateLED();
}
