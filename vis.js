import "https://d3js.org/d3.v6.min.js";

// Plot constants
const MARGIN = {LEFT: 100, RIGHT: 20, TOP: 20, BOTTOM: 100};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

// Visualization canvas
const svg = d3
  .select("#areaChart")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr("style", "background-color: gray");

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// Labels
const xLabel = g
  .append("text")
  .attr("class", "x-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text(`Year`);

const yLabel = g
  .append("text")
  .attr("class", "y-label")
  .attr("x", -HEIGHT / 2)
  .attr("y", -30)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Temperature (Celsius)");

d3.csv("data/temp-1901-2020-all.csv").then(function (data) {
  data = d3.group(data, (d) => d.Country);
  console.log(data);
});
