import * as areaChart from "./areaChart.js";
import * as polarArea from "./polarArea.js";
import * as choroplethMap from "./choroplethMap.js";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const firstYear = 1901;
const lastYear = 2020;
let country = "NZL";
let year = firstYear;
let month = 0;

// Init charts
areaChart.initChart("#areaChart");
polarArea.initChart("#polarArea");
choroplethMap.initChart("#choroplethMap");

// Datasets to load
let dataPromises = [
  d3.csv("data/temp-1901-2020-all.csv"),
  d3.json("data/world.geo.json")
];

// Load datasets and start visualization
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
    year = year < lastYear ? year + 1 : firstYear;
    yearData = tempData.get(String(year));
    countryData = yearData.get(country);
    areaChart.updateChart(countryData);
    polarArea.updateChart(countryData);
    choroplethMap.updateChart(topoData, yearData, month);
  }, 400)

  // UI
  // Add month names to months drop down menu
  monthNames.forEach((month, i) => {
    document.getElementById('month-list').innerHTML += (
      `<li><a class="dropdown-item" value=${i}>${month}</a></li>`
    );
  });
  // Change months according to month menu
  document.querySelectorAll('#month-list li').forEach(item =>
    item.addEventListener("click", event => {
      month = event.target.getAttribute("value");
    }));

  // Add years to years drop down menu
  for(let year of tempData.keys()) {
    document.getElementById('year-list').innerHTML += (
      `<li><a class="dropdown-item">${year}</a></li>`
    );
  };
  // Change year according to year menu
  document.querySelectorAll('#year-list li').forEach(item =>
    item.addEventListener("click", event => {
      year = +event.target.innerHTML;
    }));

  // Add countries to countries drop down menu
  for(let [iso, isoData] of tempData.get(String(firstYear))) {
    const countryName = isoData[0].Country;
    document.getElementById('country-list').innerHTML += (
      `<li><a class="dropdown-item" value=${iso}>${countryName}</a></li>`
    );
  };
  // Change country according to country menu
  document.querySelectorAll('#country-list li').forEach(item =>
    item.addEventListener("click", event => {
      country = event.target.getAttribute("value");
    }));
});
