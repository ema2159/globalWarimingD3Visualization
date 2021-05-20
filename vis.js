import * as areaChart from "./areaChart.js";
import * as polarArea from "./polarArea.js";
import * as choroplethMap from "./choroplethMap.js";


let country = "RUS";
let year = 1901;
let month = 0;

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
  tempData = d3.group(tempData, (d) => d.Year, (d) => d.ISO3);
  console.log(tempData);
  
  let yearData = tempData.get(String(year));
  console.log(yearData);
  let countryData = yearData.get(country);
  console.log(countryData);
  areaChart.updateChart(countryData);
  polarArea.updateChart(countryData, month);
  choroplethMap.updateChart(topoData, yearData, month);

  d3.interval(() => {
    year = year < 2020 ? year + 1 : 1901;
    yearData = tempData.get(String(year));
    countryData = yearData.get(country);
    areaChart.updateChart(countryData);
    polarArea.updateChart(countryData);
  }, 1200)

  d3.interval(() => {
    month = month < 11 ? month + 1 : 0;
    yearData = tempData.get(String(year));
    countryData = yearData.get(country);
    choroplethMap.updateChart(topoData, yearData, month);
  }, 100)
});
