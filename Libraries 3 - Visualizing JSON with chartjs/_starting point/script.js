"use strict";

/*
  The example JSON is from https://covid19-api.weedmark.systems
  Pulled on 220117

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
    callback(json);
  } else {
    const errorMessage = `An error has occured: ${response.status}`;
    throw new Error(errorMessage);
  }
}


// We need to host a local server (through Live Preview) to get the file,
// So we use the leading slash in the path-name
const JSONSweden = "/sweden.json";
// const JSONCanada = "/canada.json"; // There is a dataset for Canada if you want to play around with comparisons