// Plot constants
const WIDTH = 1400;
const HEIGHT = 800;

let svg, g, path, projection, x, colorScale;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  g = svg.append("g");

  // Map and projection
  path = d3.geoPath();
  projection = d3
    .geoEqualEarth()
    .scale(250)
    .center([0, 0])
    .translate([WIDTH / 2, HEIGHT / 2]);

  colorScale = d3.scaleLinear().domain([-30, 30]).range(["#3C81B7", "#dc2f02"]);

  g = svg.append("g").attr("class", "key").attr("transform", "translate(0,40)");

  // g.selectAll("rect")
  //   .data(colorScale.range().map(function(d) {
  //     d = colorScale.invertExtent(d);
  //     if (d[0] == null) d[0] = x.domain()[0];
  //     if (d[1] == null) d[1] = x.domain()[1];
  //     return d;
  //   }))
  //   .enter().append("rect")
  //   .attr("height", 8)
  //   .attr("x", function(d) { return x(d[0]); })
  //   .attr("width", function(d) { return x(d[1]) - x(d[0]); })
  //   .attr("fill", function(d) { return colorScale(d[0]); });

  // g.append("text")
  //   .attr("class", "caption")
  //   .attr("x", x.range()[0])
  //   .attr("y", -6)
  //   .attr("fill", "#000")
  //   .attr("text-anchor", "start")
  //   .attr("font-weight", "bold")
  //   .text("Temperature");

  // g.call(d3.axisBottom(x)
  //        .tickSize(13)
  //        .tickFormat(function(x, i) { return i ? x : x + "℃"; })
  //        .tickValues(colorScale.domain()))
  //   .select(".domain")
  //   .remove();
}

function updateChart(topo, data, month) {
  const trans = d3.transition().duration(100);
  const choroMap = g.selectAll("path").data(topo.features);

  choroMap.exit().remove();
  // Draw the map
  choroMap
    .enter()
    .append("path")
    .merge(choroMap)
    .transition(trans)
    // draw each country
    .attr("d", path.projection(projection))
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.properties["iso_a3"]);

      return d.total ? colorScale(d.total[month].Temperature) : 30;
    });
}

export {initChart, updateChart};
