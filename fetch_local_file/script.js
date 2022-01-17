"use strict";

/*
  A short example in which we use `fetch()` to load a local .json file.
  The same technique could be used to load any kind of local file, just make sure
  to use the correct method to get the data out of the response object.
  See: http://developer.mozilla.org/en-US/docs/Web/API/Response for all methods.

  The example JSON is from https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON

  NOTE: You will need to run this example using VS Code Live preivew because of
  browser file access policies. It will not work if ran on its own.

  - Love Lagerkvist, 2022, Malmö University
*/


/*
  Async function that reads the file at `path` and feeds it into
  the provided `callback` function. For further data processing.
  Errors if `path` is invalid or if it is unable to read the file.
*/
const localJSON = async (path, callback) => {
  const response = await fetch(path);

  if (response.ok) {
    const json = await response.json();
    console.log("This is the data found in the JSON file:");
    console.dir(json)
    console.log("We will now act on it using a callback function, in this case:", callback);
    callback(json);
  } else {
    const errorMessage = `An error has occured: ${response.status}`;
    throw new Error(errorMessage);
  }
}


// We need to host a local server (through Live Preview) to get the file,
// So we use the leading slash in the path-name
const JSONPath = "/example.json";


// We use our async function to get the JSON and we provide an inline/anonymous
// callback function that takes the data and produces some HTML.
localJSON(JSONPath, (json) => {
  const main = document.createElement("main");

  const squadName = document.createElement("h1");
  squadName.append(json.squadName);

  const squadMetadata = document.createElement("p");
  squadMetadata.append(`Formed: ${json.formed}, Home town: ${json.homeTown}, Secret Base: ${json.secretBase}`);

  const squadMembers = document.createElement("ul");
  for (const member of json.members) {
    const aMember = document.createElement("li");
    aMember.append(`${member.name}, ${member.age}, ${member.secretIdentity}`);
    squadMembers.append(aMember);
  }

  main.append(squadName, squadMetadata, squadMembers);
  document.body.append(main);
});

