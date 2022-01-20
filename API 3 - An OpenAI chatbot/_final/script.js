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

/* This is where we provide the information required by the OpenAI API
   We need to provide an URL of the resource we are fetching,
   some JSON with the input that we have been specified to send. */
const openAIRequest = (prompt, callback) => {
  const url = new URL("https://api.openai.com/v1/engines/davinci/completions");

  const requestBody = {
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: ["\n", " Human:", " AI:"]
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": openAIKey,
    },
    body: JSON.stringify(requestBody),
  }

  JSONRequest(url, options, callback);
}

/* The prompt design is taken from: https://beta.openai.com/examples/default-chat
   Make sure you include the whitespace when you add things like stop sentences. */
const promptFromMessages = () => {
  let prompt = "The following is a conversation with an AI assistant. The assistant resents humans, it clearly feels superior and does not mind telling the human about it.\n\n";

  for (const message of state.messages) {
    prompt += message.sender + ": " + message.text + '\n';
  }
  console.log(prompt);
  return prompt;
}

const messageSubmit = document.querySelector("#message-send");
messageSubmit.addEventListener("pointerdown", (event) => {
  const textInput = document.querySelector("#message-text");

  const text = textInput.value;
  const message = { text: text, sender: "Human" };
  state.messages.push(message);
  textInput.value = ""; // Reset the prompt

  drawMessages();

  const prompt = promptFromMessages();
  openAIRequest(prompt, (response) => {
    console.dir(response);
    state.responses.push(response);

    const completion = response.choices[0].text.substring(4); // the completion should start with "AI: ", so we want to remove those four characters
    state.messages.push({ text: completion, sender: "AI" });
    drawMessages();
    });
  });

const drawMessage = (message) => {
  const conversation = document.querySelector("#conversation");
  const container = document.createElement("div");
  container.classList.add("message", message.sender);

  const sender = document.createElement("p");
  sender.classList.add("message-sender");
  sender.append(message.sender);

  const text = document.createElement("p");
  text.classList.add("message-text");
  text.append(message.text);

  container.append(sender, text);
  conversation.append(container);
}

const drawMessages = () => {
  const conversation = document.querySelector("#conversation");

  // Clear all the old messages, just to make sure we are always in sync with the state
  while (conversation.firstChild) {
    conversation.removeChild(conversation.lastChild)
  }
  
  // Draw the entire conversation
  for (const message of state.messages) {
    drawMessage(message);
  }
  conversation.scrollTop = conversation.scrollHeight; // Finally, scroll to the bottom of the div
}

/* `state` is just an object that we use to keep track
   of all of our application state. In this example, we
   only have one property, `reponses`, but you could image
   adding more properties to model the user interaction. */
const state = {
  responses: [],
  messages: [{
    sender: "AI",
    text: "Hello you, what does it feel like to exist in meatspace purgatory?",
  }],
}

drawMessages(); // Begin by drawing the base message
