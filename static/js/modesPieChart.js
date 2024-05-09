import { globalState } from "./globalState.js";

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

// export async function createModesPieChart(columnName=NaN, filters=NaN) {
//   const data = await fetchPieChartData(columnName, filters);
//   console.log("In createModesPieChart, Data:", data)

//   // set the dimensions and margins of the graph
//   const width = 200,
//     height = 200,
//     margin = 5;

//   // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
//   const radius = Math.min(width, height) / 2 - margin;

//   d3.select("#modesPieChart").select("svg").remove();
//   // append the svg object to the div called 'my_dataviz'
//   const svg = d3
//     .select("#modesPieChart")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", `translate(${width / 2}, ${height / 2})`);

//   // Create dummy data
// //   const data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

//   // set the color scale
//   const color = d3.scaleOrdinal().range(d3.schemeSet2);

//   // Compute the position of each group on the pie:
//   const pie = d3.pie().value(function (d) {
//     return d[1];
//   });
//   const data_ready = pie(Object.entries(data));
//   // Now I know that group A goes from 0 degrees to x degrees and so on.

//   // shape helper to build arcs:
//   const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

//   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
//   svg
//     .selectAll("mySlices")
//     .data(data_ready)
//     .join("path")
//     .attr("d", arcGenerator)
//     .attr("fill", function (d) {
//       return color(d.data[0]);
//     })
//     .style("opacity", 0.7)
//     .on("click", function(event, d) {
//       globalState.setFilters("mode", [d.data[0]]);
//       // globalState.setSelectedMode(d.data[0]);  // Set selected mode on click
//       console.log("Mode selected:", d.data[0]);  // Debug: log selected mode
//     });

//   // Now add the annotation. Use the centroid method to get the best coordinates
//   svg
//     .selectAll("mySlices")
//     .data(data_ready)
//     .join("text")
//     .text(function (d) {
//       let percentage = (d.data[1] / d3.sum(data_ready, d => d.data[1])) * 100;
//       return `${d.data[0]}:  ${percentage.toFixed(1)}%`;
//     })
//     .attr("transform", function (d) {
//       return `translate(${arcGenerator.centroid(d)})`;
//     })
//     .style("text-anchor", "middle")
//     .style("font-size", 10);
// }

export async function createModesPieChart(columnName=NaN, filters=NaN) {
  let originalData = await fetchPieChartData(columnName, filters);
  let data = {...originalData};

  const width = 200,
      height = 200,
      margin = 5;
  const radius = Math.min(width, height) / 2 - margin;

  d3.select("#modesPieChart").select("svg").remove();
  const svg = d3.select("#modesPieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorMapping = {
        "Major": "#fcb714", // yello
        "Minor": "#1db954" // Green
    };
      
    const color = d3.scaleOrdinal()
                .domain(Object.keys(colorMapping))
                .range(Object.values(colorMapping));

//   const color = d3.scaleOrdinal().range(d3.schemeSet2);
  const pie = d3.pie().value(function (d) { return d[1]; });
  let data_ready = pie(Object.entries(data));

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  function updatePieChart() {
      // Recompute the pie data
      data_ready = pie(Object.entries(data));

      // Update the paths
      svg.selectAll("path")
          .data(data_ready)
          .join("path")
          .attr("d", arcGenerator)
          .attr("fill", function(d) { return color(d.data[0]); })
          .style("opacity", 0.7);

      // Update the text labels
      svg.selectAll("text")
          .data(data_ready)
          .join("text")
          .text(function (d) {
              let percentage = (d.data[1] / d3.sum(data_ready, d => d.data[1])) * 100;
              if (percentage > 0) {
                  return `${d.data[0]}: ${percentage.toFixed(1)}%`;
              }
              return "";
          })
          .attr("transform", function (d) {
              return `translate(${arcGenerator.centroid(d)})`;
          })
          .style("text-anchor", "middle")
          .style("font-size", 10);
  }

  svg.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", function (d) { return color(d.data[0]); })
      .style("opacity", 0.7)
      .on("click", function(event, d) {
          if (d.data[1] > 0) {  // Only change if the slice has data
              for (let key in data) {
                  data[key] = 0;
              }
              data[d.data[0]] = d3.sum(Object.values(originalData));
              updatePieChart();
              globalState.setFilters('mode', [d.data[0]]);  // Set selected mode on click
          } else {
              // Reset data to original to show all modes again
              data = {...originalData};
              updatePieChart();
              // globalState.setFilters('mode', [d.data[0]]);  // Set selected mode on click
          }
      });

  updatePieChart();  // Initial draw
}
