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

// Init slider variables
const slider = document.getElementById("yearSlider");
slider.min = firstYear;
slider.max = lastYear;

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
  
  function updateCharts() {
    const yearData = tempData.get(String(year));
    const countryData = yearData.get(country);
    areaChart.updateChart(countryData);
    polarArea.updateChart(countryData, month);
    choroplethMap.updateChart(topoData, yearData, month);
  }
  updateCharts();

  let interval = d3.interval(() => {
    year = year < lastYear ? year + 1 : firstYear;
    slider.value = year;
    updateCharts();
  }, 400)

  // UI
  // Slider
  let moving = true;
  slider.addEventListener("input", event => {
    if(moving) {
      interval.stop();
    }
    year = +slider.value;
    updateCharts();
  });
  slider.addEventListener("pointerup", event => {
    if(moving) {
      interval = d3.interval(() => {
        year = year < lastYear ? year + 1 : firstYear;
        slider.value = year;
        updateCharts();
      }, 400)
    }
  });
  // Play/pause button
  // document.getElementById('month-list').addEventListener();
  const playButton = d3.select("#play-button");
  playButton
    .on("click", function() {
      let button = d3.select(this);
      if (button.text() == "Pause") {
        moving = false;
        interval.stop();
        button.text("Play");
      } else {
        moving = true;
        interval = d3.interval(() => {
          year = year < lastYear ? year + 1 : firstYear;
          yearData = tempData.get(String(year));
          countryData = yearData.get(country);
          areaChart.updateChart(countryData);
          polarArea.updateChart(countryData);
          choroplethMap.updateChart(topoData, yearData, month);
        }, 400)
        button.text("Pause");
      }
      console.log("Slider moving: " + moving);
    })
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
      updateCharts();
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
      updateCharts();
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
      updateCharts();
    }));
});
