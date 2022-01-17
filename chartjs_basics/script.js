"use strict"

/*
  This is more or less the example from: https://www.chartjs.org/docs/latest/getting-started/usage.html
  See the demo video.
  - Love Lagerkvist, 220117, Malmö Universitet
*/

// First, we want to declare our dataset, with labels and the data as such:
const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
];

const data = {
  labels: labels,
  datasets: [{
    label: "My first dataset",
    backgroundColor: "rgb(255, 99, 132)",
    broderColor: "rgb(255, 99, 132)",
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: "line",
  data: data,
  options: {}
};

const canvas = document.querySelector("#chart-js-canvas");
const chart = new Chart(canvas, config); // This is the magic line.
//  `Chart` is an object that we get from chart.js, it does not exist by default. 
