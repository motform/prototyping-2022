
/*
 - Love Lagerkvist, 220117, Malmö University
 */

#include <ArduinoJson.h>

const byte JOYSTICK_PIN_X = A0;
const byte JOYSTICK_PIN_Y = A2;
const byte JOYSTICK_PIN_BUTTON = 2;

int joystickRawX = 0;
int joystickRawY = 0;

int joystickMappedX = 0;
int joystickMappedY = 0;

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
    joystickRawX = analogRead(JOYSTICK_PIN_X);
    joystickRawY = analogRead(JOYSTICK_PIN_Y);

    // `map` the values to fit to a range that makes more logical sense
    joystickMappedX = map(joystickRawX, 0, 1023, -512, 512);
    joystickMappedY = map(joystickRawY, 0, 1023, -512, 512);

    // The button reads 1 when not pressed and 0 when pressed
    // This is a bit confusing, so we compare it to LOW to 
    // effectievly flip the bit. I.e., if the button is pressed
    // we turn a 0 into 1, or logical true.
    joystickPressed = digitalRead(JOYSTICK_PIN_BUTTON) == LOW;  
}

void sendJoystickJSON() {
  StaticJsonDocument<56> json;

  json["x"] = joystickMappedX;
  json["y"] = joystickMappedY;
  json["pressed"] = joystickPressed;

  serializeJson(json, Serial);
  Serial.println();
}

void loop() {
    updateJoystick();
    sendJoystickJSON();
}
