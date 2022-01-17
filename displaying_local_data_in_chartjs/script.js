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


// We use our async function to get the JSON and we provide an inline/anonymous
// callback function that takes the data and produces some HTML.
localJSON(JSONSweden, (json) => {
  // First, we get to the relevant part of the JSON
  const datapoints = json.data.covid19Stats;
  console.dir(datapoints);

  /*
   Next, we need to transform the dataset into the representation
   specified by chart.js' interface.  We need to go to the
   documentation to find this: https://www.chartjs.org/docs/latest/charts/bar.html
  */

  // The labels for the x-axis
  const labels = [];

  // Our two datasets, "confirmed" and "deaths"
  const confirmed = {
    label: "Confirmed",
    data: [],
    borderWidth: 1,
    backgroundColor: ["lightgray"],
  };

  const deaths = {
    label: "Deaths",
    data: [],
    borderWidth: 1,
    backgroundColor: ["crimson"],
  };

  // Loop over the datapoints from the JSON to extract the information out of the
  // dataset, pushing them into the places that chart.js expects
  for (const datapoint of datapoints) {
    // console.dir(datapoint); // DEBUG: if you want to see what each item is
    labels.push(datapoint.province);
    deaths.data.push(datapoint.deaths);
    confirmed.data.push(datapoint.confirmed);
  }

  // Assemble the extracted and transformed data into chart.js's 
  // top level data object.
  const data = {
    label: "Covid-19 Statictics in Sweden",
    labels: labels,
    datasets: [confirmed, deaths],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  // Finally, make the chart!
  const canvas = document.querySelector("#chart-js-canvas");
  const chart = new Chart(canvas, config);
});

