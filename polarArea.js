// Plot constants
const MARGIN = {LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const INNERRADIUS = 60;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT) / 2;

let svg, g, xLabel, yLabel, x, y, colorScale, xAxisGroup, yAxisGroup;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")");

  // Scales
  x = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);
  y = d3.scaleLinear().range([INNERRADIUS, OUTERRADIUS]);

  // Color scaleBand
  colorScale = d3.scaleSqrt().domain([-30, 30]).range(["steelblue", "#dc2f02"]);
}

function updateChart(data) {
  // xLabel.text(`Year ${data[0].Year}`);
  // Add domains
  x.domain(data.map((d) => d.Statistics.slice(0, 3)));
  y.domain([-30, 30]);

  // Add bars
  g.selectAll("path")
    .data(data)
    .enter()
    .append("path")
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
      return -y(d);
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
    .data(data.map((d) => d.Statistics.slice(0, 3)))
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return (
        "rotate(" +
        ((x(d) * 180) / Math.PI - 90) +
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
}

export {initChart, updateChart};
