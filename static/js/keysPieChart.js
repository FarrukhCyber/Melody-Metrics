async function fetchPieChartData() {
  const response = await fetch("/keys");
  const data = await response.json();
  return data;
}

export async function createKeysPieChart() {
    const data = await fetchPieChartData();
    console.log("In PieChart, Data:", data)
  
    // Set the dimensions and margins of the graph
    var width = 450;
    var height = 450;
    var margin = 40;
  
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;
  
    // Append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#keyDonutChart") // Changed from "#plot1" to "svg" for general usage, adjust if your SVG has a specific id
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    // Set the color scale
    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.key))
      .range(d3.schemeDark2);
  
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function (d) { return d.count; }); // Use d.count instead of d.value
  
    // The arc generator
    var arc = d3.arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);
  
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll("allSlices")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d) { return color(d.data.key); })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);
}
