import * as areaChart from "./areaChart.js";
import * as polarArea from "./polarArea.js";
import * as choroplethMap from "./choroplethMap.js";


let country = "Costa Rica";
let year = 1901;

areaChart.initChart("#areaChart");
polarArea.initChart("#polarArea");
choroplethMap.initChart("#choroplethMap");

// Datasets to load
let dataPromises = [
  d3.csv("data/temp-1901-2020-all.csv"),
  d3.json("data/world.geo.json")
]

Promise.all(dataPromises).then(function (data) {
  let tempData = data[0];
  let topoData = data[1];
  // Group data per country and per year
  tempData = d3.group(tempData, (d) => d.Country, (d) => d.Year);
  console.log(tempData);
  
  let countryData = tempData.get(country);
  console.log(countryData);
  let yearData = countryData.get(String(year));
  console.log(yearData);
  areaChart.updateChart(yearData);
  polarArea.updateChart(yearData);

  d3.interval(() => {
    year = year < 2020 ? year + 1 : 1901;
    yearData = countryData.get(String(year));
    areaChart.updateChart(yearData);
    polarArea.updateChart(yearData);
    choroplethMap.updateChart(topoData, yearData);
  }, 400)
});
 