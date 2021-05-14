import "https://d3js.org/d3.v5.min.js";
import "https://raw.githack.com/jamesleesaunders/d3-ez/master/dist/d3-ez.js";

let country = "Argentina";
let year = "2000";

let chart = d3.ez.chart
  .polarAreaChart()
  .colors(d3.ez.palette.sequential("#0096c7", 3));
let legend = d3.ez.component.legend().title("Month");
let title = d3.ez.component
  .title()
  .mainText(`Monthly average temperature in ${country}`)
  .subText(`Year ${year}`);

// Create chart base
let myChart = d3.ez
  .base()
  .width(750)
  .height(800)
  .chart(chart)
  .title(title)
  .on("customValueMouseOver", function (d, i) {
    d3.select("#message").text(d.value);
  });

// Add to page
function updatePolarChart() {
  d3.csv("data/temp-1901-2020-all.csv", function (d) {
    if (d["Country"] == country && d["Year"] == year) {
      return {key: d["Statistics"].slice(0, -8), value: d["Temperature"]};
    }
  }).then(function (d) {
    console.log(d.slice(0, -1));
    let data = {key: "Month", values: d.slice(0, d.length)};
    console.log(data);
    d3.select("#chartholder").datum(data).call(myChart);
    document.querySelector('.creditbox').style.display = 'none';
  });
}

updatePolarChart();
// setInterval(update, 2000);
