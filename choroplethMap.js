// Plot constants
const WIDTH = 1000;
const HEIGHT = 600;

let svg, g, path, projection, x, colorScale;

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
    .scale(200)
    .center([0,20])
    .translate([WIDTH / 2, HEIGHT / 2]);

  x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

  colorScale = d3.scaleThreshold()
  .domain([-30, -10, 0, 10, 30])
  .range(d3.schemeBlues[7]);
  
  g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

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
      d.total = data.get(d.properties["iso_a3"]) || [{Temperature: 20}];
      if(d.properties["iso_a3"]==="GHA") console.log(d);
      return colorScale(d.total[0].Temperature);
    });
}

export {initChart, updateChart};
