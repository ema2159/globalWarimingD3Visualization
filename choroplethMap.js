// Plot constants
const WIDTH = 700;
const HEIGHT = 500;

let svg, g, path, projection, x, color;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);
  
  // Map and projection
  path = d3.geoPath();
  projection = d3.geoEqualEarth()
    .scale(70)
    .center([0,20])
    .translate([WIDTH / 2, HEIGHT / 2]);

  x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

  color = d3.scaleThreshold()
    .domain(d3.range(2, 10))
    .range(["#3C81B7", "#CE241C"]);

  g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

  g.selectAll("rect")
    .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

  g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Temperature");

  g.call(d3.axisBottom(x)
         .tickSize(13)
         .tickFormat(function(x, i) { return i ? x : x + "℃"; })
         .tickValues(color.domain()))
    .select(".domain")
    .remove();
}

function updateChart(topo, data) {
  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
  // draw each country
    .attr("d", d3.geoPath()
          .projection(projection)
         )
  // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    });
}

export {initChart, updateChart};
