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
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// Labels
// X label
const xLabel = g
  .append("text")
  .attr("class", "x-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")

const yLabel = g
  .append("text")
  .attr("class", "y-label")
  .attr("x", -HEIGHT / 2)
  .attr("y", -30)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Temperature (Celsius)");

// Scales
// const x = d3.scaleUtc().range([0, WIDTH]);
const x = d3.scaleTime().range([0, WIDTH]);
const y = d3.scaleLinear().range([HEIGHT, 0]);

// Axes initialization
const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "y axis");

function updateChart(data) {
  xLabel.text(`Year ${data[0].Year}`);
  // Add domains
  const timeParser = d3.timeParse("%b");
  const dateRange = data.map((d) => timeParser(d.Statistics.slice(0, 3)));
  x.domain(d3.extent(dateRange));
  y.domain([
    Math.min(
      0,
      d3.min(data, (d) => Number(d.Temperature))
    ),
    Math.max(
      0,
      d3.max(data, (d) => Number(d.Temperature))
    ),
  ]);
  console.log(d3.min(data, (d) => Number(d.Temperature)));

  // Line and area generator
  let curve = d3.curveMonotoneX;
  const line = d3
    .line()
    .curve(curve)
    .x((d) => x(timeParser(d.Statistics.slice(0, 3))))
    .y((d) => y(d.Temperature));

  const area = d3
    .area()
    .curve(curve)
    .x((d) => x(timeParser(d.Statistics.slice(0, 3))))
    .y0(y(0))
    .y1((d) => y(d.Temperature));

  // Add axes
  const xAxisCall = d3
    .axisBottom(x)
    .ticks(d3.timeMonth, 1)
    .tickFormat(d3.timeFormat("%b"));
  xAxisGroup.call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  yAxisGroup.call(yAxisCall);

  // Add line and area
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  g.append("path")
    .datum(data)
    .attr("fill", "steelblue")
    .attr("opacity", 0.5)
    .attr("d", area);
}

let country = "Russia";
let year = "2012";
let chart, title, myChart;

d3.csv("data/temp-1901-2020-all.csv").then(function (data) {
  data = d3.group(data, (d) => d.Country);

  let countryData = data.get(country);
  console.log(countryData);
  let yearGroupedData = d3.group(countryData, (d) => d.Year);
  let yearData = yearGroupedData.get(year);
  console.log(yearData);
  updateChart(yearData);
});
