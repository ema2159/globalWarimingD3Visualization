// Plot constants
const MARGIN = {LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const INNERRADIUS = 30;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT) / 2;

let svg, g, xLabel, yLabel, x, y, xAxisGroup, yAxisGroup;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr("transform", "translate(" + WIDTH/2 + "," + HEIGHT/2 + ")");;

  // Labels
  // xLabel = g
  //   .append("text")
  //   .attr("class", "x-label")
  //   .attr("x", WIDTH / 2)
  //   .attr("y", HEIGHT + 40)
  //   .attr("font-size", "20px")
  //   .attr("text-anchor", "middle");

  // yLabel = g
  //   .append("text")
  //   .attr("class", "y-label")
  //   .attr("x", -HEIGHT / 2)
  //   .attr("y", -30)
  //   .attr("font-size", "20px")
  //   .attr("text-anchor", "middle")
  //   .attr("transform", "rotate(-90)")
  //   .text("Temperature (Celsius)");

  // Scales
  x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);
  y = d3.scaleLinear()
    .range([INNERRADIUS, OUTERRADIUS])
}

function updateChart(data) {
  // xLabel.text(`Year ${data[0].Year}`);
  // Add domains
  x.domain(data.map(d => d.Statistics.slice(0, 3)));
  y.domain([-30, 30]);
  
  // Add bars
  g.selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", "steelblue")
    .attr("opacity", 0.8)
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(INNERRADIUS)
          .outerRadius(function(d) { return y(d.Temperature); })
          .startAngle(function(d) { return x(d.Statistics.slice(0, 3)); })
          .endAngle(function(d) { return x(d.Statistics.slice(0, 3)) + x.bandwidth(); })
          .padAngle(0.08)
          .padRadius(INNERRADIUS))

  // Axes initialization
  xAxisGroup = g
    .append("g")
    .attr("class", "x axis")
    .attr("text-anchor", "middle")
  //   .attr("transform", `translate(0, ${HEIGHT})`);

  yAxisGroup = g.append("g").attr("class", "y axis");
  const yTicks = yAxisGroup
      .selectAll("g")
      .data(y.ticks(5))
      .enter().append("g");
  
  yTicks.append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("r", y);
  
  yTicks.append("text")
    .attr("y", function(d) { return -y(d); })
    .attr("dy", "0.35em")
    .text(function(d) { return d + "℃"; });
  
  yAxisGroup.append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("r", function() { return y(y.domain()[0])});
}

export {initChart, updateChart};
