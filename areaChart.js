// Plot constants
const MARGIN = {LEFT: 100, RIGHT: 20, TOP: 20, BOTTOM: 100};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

let svg, g, xLabel, yLabel, x, y, xAxisGroup, yAxisGroup, timeParser, dateRange;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
  g.append("path").attr("class", "plot");

  // Labels
  xLabel = g
    .append("text")
    .attr("class", "x-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle");

  yLabel = g
    .append("text")
    .attr("class", "y-label")
    .attr("x", -HEIGHT / 2)
    .attr("y", -30)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Temperature (Celsius)");

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
  timeParser = d3.timeParse("%b");
  dateRange = monthNames.map((month) => timeParser(month));

  x = d3.scaleTime().range([0, WIDTH]);
  y = d3.scaleLinear().range([HEIGHT, 0]);
  x.domain(d3.extent(dateRange));

  // Axes initialization
  xAxisGroup = g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`);

  yAxisGroup = g.append("g").attr("class", "y axis");

  // Add x axis
  const xAxisCall = d3
    .axisBottom(x)
    .ticks(d3.timeMonth, 1)
    .tickFormat(d3.timeFormat("%b"));
  xAxisGroup.call(xAxisCall);
}

function updateChart(data) {
  const trans = d3.transition().duration(400);

  xLabel.text(`Year ${data[0].Year}`);
  // Add domains
  y.domain([
    d3.min(data, (d) => Number(d.Temperature)) < 0 ? -30 : 0,
    30
  ]);

  // Line and area generator
  let curve = d3.curveMonotoneX;
  const line = d3
    .line()
    .curve(curve)
    .x((d) => x(timeParser(d.Statistics.slice(0, 3))))
    .y((d) => y(d.Temperature));

  const area = d3
    .area()
    .curve(curve)
    .x((d) => x(timeParser(d.Statistics.slice(0, 3))))
    .y0(y(0))
    .y1((d) => y(d.Temperature));

  // Add y axis
  const yAxisCall = d3.axisLeft(y);
  yAxisGroup.call(yAxisCall);

  g.append("linearGradient")
    .attr("id", "temperature-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(-20))
    .attr("x2", 0)
    .attr("y2", y(20))
    .selectAll("stop")
    .data([
      {offset: "45%", color: "#3C81B7"},
      {offset: "70%", color: "#CE241C"},
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  const linePath = g.selectAll("path.plot")
        .datum(data);

  linePath.exit().remove();

  // Add line and area
  linePath
    .merge(linePath)
    .transition(trans)
    .attr("fill", "none")
    .attr("stroke", "#8d99ae")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  const areaPath = g.selectAll("path.plot")
    .datum(data);

  areaPath.exit().remove();

  areaPath
    .merge(areaPath)
    .transition(trans)
    .attr("fill", "url(#temperature-gradient)")
    .attr("opacity", 0.8)
    .attr("d", area);
}

export {initChart, updateChart};
