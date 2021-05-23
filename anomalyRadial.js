// Plot constants
const MARGIN = {LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 30};
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT, 500)/2;
const INNERRADIUS = OUTERRADIUS * 0.1;

let svg,
    g,
    colorScale,
    distScale,
    radialScale,
    title,
    line,
    barWrapper;


// Domain data
const domLow = -1.5,  //-15, low end of data
      domHigh = 1.25,  //30, high end of data
      axisTicks = [-1, 0, 1];   //[-20,-10,0,10,20,30];  [-2,-1,0,1,2,3];  [-1.5,-0.5,0.5,1.5];

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
      "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2 + 20) + ")"
    );
  
  //Base the color scale on average temperature extremes
  colorScale = d3.scaleLinear()
      .domain([domLow, (domLow+domHigh)/2, domHigh])
      .range(["#2c7bb6", "#ffff8c", "#d7191c"])
      .interpolate(d3.interpolateHcl);

  //Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
  distScale = d3.scaleLinear()
      .range([INNERRADIUS, OUTERRADIUS])
      .domain([domLow, domHigh]); 
  
  radialScale = d3.scaleLinear()
    .range([0, Math.PI*2])  
    .domain([1, 12]); // for 12 months

  // Title
  //Append title to the top
  title = g.append("g")
    .attr("class", "title")
    .append("text")
    .attr("dy", HEIGHT/2)
    .attr("text-anchor", "middle")
    .text("Temperature Anomaly");

  // Add axes
  //Wrapper for the bars and to position it downward
  barWrapper = svg.append("g")
    .attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT / 2) + ")");
  
  //Draw gridlines below the bars
  const axes = barWrapper.selectAll(".gridCircles")
      .data(axisTicks)
      .enter().append("g");
  //Draw the circles
  axes.append("circle")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("opacity", 0.2)
    .attr("class", "axisCircles")
    .attr("r", function(d) { return distScale(d); });
  //Draw the axis labels
  axes.append("text")
    .attr("class", "axisText")
    .attr("y", function(d) { return distScale(d) - 8; })
    .attr("dy", "0.3em")
    .text(function(d) { return d + "°C"});

  //Add January for reference
  barWrapper.append("text")
    .attr("class", "january")
    .attr("x", 7)
    .attr("y", -OUTERRADIUS)
    .attr("dy", "0.9em")
    .text("January");
  //Add a line to split the year
  barWrapper.append("line")
    .attr("class", "yearLine")
    .attr("stroke", "black")
    .attr("opacity", 0.5)
    .attr("x1", 0)
    .attr("y1", -INNERRADIUS * 1.8)  //.65
    .attr("x2", 0)
    .attr("y2", -OUTERRADIUS * 1.1);

  //Add year in center
  barWrapper.append("text")
    .attr("class", "yearText")
    .attr("text-anchor", "middle")
    .attr("y", 8)
    .text("1850");

  // Add radial gradient for the line
  const numStops = 10;
  let tempRange = distScale.domain();
  tempRange[2] = tempRange[1] - tempRange[0];
  const tempPoint = [];
  for(let i = 0; i < numStops; i++) {
    tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
  }

  //Create the radial gradient
  svg.append("defs")
    .append("radialGradient")
    .attr("id", "radial-gradient")
    .selectAll("stop") 
    .data(d3.range(numStops))               
    .enter()
    .append("stop")
    .attr("offset", (d, i) => distScale(tempPoint[i])/ OUTERRADIUS)      
    .attr("stop-color", (d, i) => colorScale(tempPoint[i]));

  line = d3.lineRadial()
    .angle(function(d) { return radialScale(d.Month); })
    .radius(function(d) { return distScale(d.Anomaly); });
}

function updateChart(data, year) {
  const trans = d3.transition().duration(400);
  const yearData = data.get(String(year));
  //Create path using line function
  const path = barWrapper.append("path")
        .attr("fill", "none")
        .attr("d", line(yearData))
        .attr("class", "line")
        .attr("x", -0.75)
        .style("stroke", "url(#radial-gradient)")

  const totalLength = path.node().getTotalLength();

  path.attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition(trans)
    .attr("stroke-dashoffset", 0);
}

export {initChart, updateChart};
