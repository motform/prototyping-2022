"use strict";

/* This script communicates with the OpenAI API using POST requests.
   It still sends a single request, but this time, the user sets the prompt.

   You will have to provide your own API key for this to work,
   see the variable "openAIKey". Get a key: https://openai.com/api/

   - Love Lagerkvist, 220110, Malmö Universitet
*/


const openAIKey = "";
if (openAIKey.length === 0) {
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
