// Plot constants
const MARGIN = {LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const INNERRADIUS = 60;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT) / 2;

let svg, g, xLabel, yLabel, x, y, colorScale, xAxisGroup, yAxisGroup, title;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + WIDTH / 2 + "," + (HEIGHT / 2 + 20) + ")"
    );

  // Scales
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  x = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(monthNames);
  y = d3.scaleLinear().range([INNERRADIUS, OUTERRADIUS]).domain([-40, 30]);

  // Color scaleBand
  colorScale = d3.scaleSqrt().domain([-30, 30]).range(["#3C81B7", "#CE241C"]);

  // Axes initialization
  // Y axis
  yAxisGroup = g.append("g").attr("class", "y axis");

  const yTicks = yAxisGroup.selectAll("g").data(y.ticks(5)).enter().append("g");

  yTicks
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("r", y);

  yTicks
    .append("text")
    .attr("y", function (d) {
      return -y(d+3);
    })
    .attr("dy", "0.35em")
    .text(function (d) {
      return d + "℃";
    });

  yAxisGroup
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("r", function () {
      return y(y.domain()[0]);
    });

  // X axis
  xAxisGroup = g.append("g").attr("class", "x axis");

  let xTicks = xAxisGroup
    .selectAll("g")
    .data(monthNames)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return (
        "rotate(" +
        ((x(d) * 180) / Math.PI - 75) +
        ")translate(" +
        INNERRADIUS +
        ",0)"
      );
    });

  xTicks.append("line").attr("x2", -5).attr("stroke", "#000");

  xTicks
    .append("text")
    .attr("transform", function (d) {
      var angle = x(d);
      return angle < Math.PI / 2 || angle > (Math.PI * 3) / 2
        ? "rotate(90)translate(0,22)"
        : "rotate(-90)translate(0, -15)";
    })
    .text(function (d) {
      return d;
    })
    .style("font-size", 10)
    .attr("opacity", 0.6);

  title = g.append("g")
    .attr("class", "title")
    .append("text")
    .attr("dy", "0.2em")
    .attr("text-anchor", "middle");
}

function updateChart(data) {
  const trans = d3.transition().duration(400);

  // Interactivity
  let mouseOver = function(event) {
    d3.selectAll(".Bar")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(event) {
    d3.selectAll(".Bar")
      .transition()
      .duration(200)
      .style("opacity", 1)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "none")
  }

  title
    .text(data[0].ISO3)

  const bars = g.selectAll("path").data(data);

  bars.exit().remove();

  // Add bars
  // Join
  bars
    .enter()
    .append("path")
    .lower()
    .merge(bars)
    .attr("class", "Bar")
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .transition(trans)
    .attr("fill", (d) => colorScale(d.Temperature))
    .attr("opacity", 0.8)
    .attr(
      "d",
      d3
        .arc() // imagine your doing a part of a donut plot
        .innerRadius(INNERRADIUS)
        .outerRadius(function (d) {
          return y(d.Temperature);
        })
        .startAngle(function (d) {
          return x(d.Statistics.slice(0, 3));
        })
        .endAngle(function (d) {
          return x(d.Statistics.slice(0, 3)) + x.bandwidth();
        })
        .padAngle(0.08)
        .padRadius(INNERRADIUS)
    );
}

export {initChart, updateChart};
