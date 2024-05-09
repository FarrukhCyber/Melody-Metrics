// Fetch the mode distribution from the Flask backend
async function fetchPieChartData(columnName, filters) {
  // const response = await fetch("/modes");
  // const data = await response.json();
  // return data;
  const response = await fetch("/modes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({columnName: columnName, filters: filters }),
  });
  const data = await response.json();
  console.log("CHECK:", data);
  return data;
}

export async function createModesPieChart(columnName=NaN, filters=NaN) {
  const data = await fetchPieChartData(columnName, filters);
  console.log("In createModesPieChart, Data:", data)

  // set the dimensions and margins of the graph
  const width = 200,
    height = 200,
    margin = 5;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin;

  d3.select("#modesPieChart").select("svg").remove();
  // append the svg object to the div called 'my_dataviz'
  const svg = d3
    .select("#modesPieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Create dummy data
//   const data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

  // set the color scale
  const color = d3.scaleOrdinal().range(d3.schemeSet2);

  // Compute the position of each group on the pie:
  const pie = d3.pie().value(function (d) {
    return d[1];
  });
  const data_ready = pie(Object.entries(data));
  // Now I know that group A goes from 0 degrees to x degrees and so on.

  // shape helper to build arcs:
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", function (d) {
      return color(d.data[0]);
    })
    // .attr("stroke", "black")
    // .style("stroke-width", "1px")
    .style("opacity", 0.7);

  // Now add the annotation. Use the centroid method to get the best coordinates
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("text")
    .text(function (d) {
      let percentage = (d.data[1] / d3.sum(data_ready, d => d.data[1])) * 100;
      return `${d.data[0]}:  ${percentage.toFixed(1)}%`;
    })
    .attr("transform", function (d) {
      return `translate(${arcGenerator.centroid(d)})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", 10);
}

// export async function createModesPieChart() {
//   const data = await fetchPieChartData();
//   console.log("In createModesPieChart, Data:", data)

//   // Adjust the width to create space for the legend
//   const width = 200,  // Increased width to accommodate legend
//         height = 200,
//         margin = 5,
//         legendRectSize = 10,  // Size of the legend marker
//         legendSpacing = 4  // Spacing between legend items
  
//   var legendOffset = 10  // Horizontal offset of the legend from the chart

//   const radius = Math.min(width, height) / 2 - margin;

//   const svg = d3
//     .select("#modesPieChart")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", `translate(${radius + margin}, ${height / 2})`);

//   const color = d3.scaleOrdinal().range(d3.schemeSet2);

//   const pie = d3.pie().value(function (d) {
//     return d[1];
//   });
//   const data_ready = pie(Object.entries(data));

//   const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

//   svg
//     .selectAll("mySlices")
//     .data(data_ready)
//     .join("path")
//     .attr("d", arcGenerator)
//     .attr("fill", function (d) { return color(d.data[0]); })
//     .style("opacity", 0.7);

//   svg
//     .selectAll("mySlices")
//     .data(data_ready)
//     .join("text")
//     .text(function (d) {
//       let percentage = (d.data[1] / d3.sum(data_ready, d => d.data[1])) * 100;
//       return `${percentage.toFixed(1)}%`;
//     })
//     .attr("transform", function (d) {
//       return `translate(${arcGenerator.centroid(d)})`;
//     })
//     .style("text-anchor", "middle")
//     .style("font-size", 8);

//   // Add legend to the right of the chart
//   const legend = svg.append("g")
//     .attr("transform", `translate(${radius * 2 + legendOffset}, ${-height / 2 + margin})`);

//   legend.selectAll("rect")
//     .data(data_ready)
//     .enter()
//     .append("rect")
//     .attr("x", -15)
//     .attr("y", function(d, i) { return i * (legendRectSize + legendSpacing); })
//     .attr("width", legendRectSize)
//     .attr("height", legendRectSize)
//     .style("fill", function(d) { return color(d.data[0]); });

//   legend.selectAll("text")
//     .data(data_ready)
//     .enter()
//     .append("text")
//     .attr("x", legendRectSize + 4)
//     .attr("y", function(d, i) { return i * (legendRectSize + legendSpacing) + legendRectSize/2; })
//     .text(function(d) { return d.data[0]; })
//     .style("font-size", "10px")
//     .style("fill", "white")
//     .attr("alignment-baseline", "middle");
// }
