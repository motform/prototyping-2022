/*
  A sketch that dynamically sends the current state of the joystick 
  to a JS application over Web Serial and JSON.
  
  You want to have the joystick to you board see the circut diagram in:
  arduino_as_api_2-joystick_bb.pdf

  This code assumes you have version 16.19.1 of ArduinoJson.
  It should work with most 6.x versions, but that is guaranteed. 

 - Love Lagerkvist, 220117, Malmö University
 */

#include <ArduinoJson.h>

const byte JOYSTICK_PIN_X = A0;
const byte JOYSTICK_PIN_Y = A2;
const byte JOYSTICK_PIN_BUTTON = 2;

int joystickX = 0;
int joystickY = 0;

bool joystickPressed = 0;

void setup() {
  pinMode(JOYSTICK_PIN_X, INPUT);
  pinMode(JOYSTICK_PIN_Y, INPUT);
  pinMode(JOYSTICK_PIN_BUTTON, INPUT_PULLUP);

  Serial.begin(9600); 
  while (!Serial) continue;
}

void updateJoystick() {
    // read the raw values from the joystick's axis
    joystickX = analogRead(JOYSTICK_PIN_X);
    joystickY = analogRead(JOYSTICK_PIN_Y);

    // The button reads 1 when not pressed and 0 when pressed
    // This is a bit confusing, so we compare it to LOW to 
    // effectievly flip the bit. I.e., if the button is pressed
    // we turn a 0 into 1, or logical true.
    joystickPressed = digitalRead(JOYSTICK_PIN_BUTTON) == LOW;  
}

void sendJoystickJSON() {
  StaticJsonDocument<56> json;

  json["x"] = joystickX;
  json["y"] = joystickY;
  json["pressed"] = joystickPressed;

  serializeJson(json, Serial);
  Serial.println();
}

void loop() {
    updateJoystick();
    sendJoystickJSON();
}
