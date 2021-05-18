import * as areaChart from "./areaChart.js";
import * as polarArea from "./polarArea.js";


let country = "Russia";
let year = 1901;

areaChart.initChart("#areaChart");
polarArea.initChart("#polarArea");

d3.csv("data/temp-1901-2020-all.csv").then(function (data) {
  data = d3.group(data, (d) => d.Country);

  let countryData = data.get(country);
  console.log(countryData);
  let yearGroupedData = d3.group(countryData, (d) => d.Year);
  let yearData = yearGroupedData.get(String(year));
  console.log(yearData);
  areaChart.updateChart(yearData);
  polarArea.updateChart(yearData);

  d3.interval(() => {
    year = year < 2020 ? year + 1 : 1901;
    yearData = yearGroupedData.get(String(year));
    polarArea.updateChart(yearData);
  }, 400)
});
