import * as areaChart from "./areaChart.js";


let country = "Russia";
let year = "2012";

areaChart.initChart("#areaChart");

d3.csv("data/temp-1901-2020-all.csv").then(function (data) {
  data = d3.group(data, (d) => d.Country);

  let countryData = data.get(country);
  console.log(countryData);
  let yearGroupedData = d3.group(countryData, (d) => d.Year);
  let yearData = yearGroupedData.get(year);
  console.log(yearData);
  areaChart.updateChart(yearData);
});
