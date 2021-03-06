"use strict";

/*
  This script communicates with the OpeWeatherMap API using GET requests.
  The OpenAI API we have seen before uses POST, where the inputs are sent
  in JSON as the body of the request. GET requests ignore the body, and so
  you need to modify the url parameters in order to get what you want. This
  demo is primarily an example of how you can do that in modern JS using
  the `URL` object, `URLSearchParams` and `fetch()`.

  You will have to provide your own API key for this to work,
  see the variable "openWeatherMapAPIKey". Get a key: https://openweathermap.org

  - Love Lagerkvist, 220111, Malmö Universitet
*/


const openWeatherMapAPIKey = "";
if (openWeatherMapAPIKey.length === 0) {
  alert("You need to enter an API or your request will fail.")
}

/* Generic function to call an API, returns the response as JSON.
   Assumes no knowledge of the resource it is trying to find behind the URL.
   Expects the URL to be fully prepared with any search params.
   Errors on response errors. */
const JSONRequest = async (url, options, callback) => {
  const response = await fetch(url, options);

  if (response.ok) {
    const json = await response.json();
    callback(json);
  } else {
    const errorMessage = `An error has occured: ${response.status}`;
    throw new Error(errorMessage);
  }
}
