import { globalState } from "./globalState.js";

async function fetchTop30(columnName, filters) {
    // const response = await fetch("/top30");
    // const data = await response.json();
    // // console.log(data)
    // return data;
    const response = await fetch("/top30", {
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

export async function createTop30BarChart(columnName=NaN, filters=NaN) {
    const data = await fetchTop30(columnName, filters);
    let selectedSongs = [];


    // const margin = { top: 50, right: 30, bottom: 120, left: 100 },
    const margin = { top: 10, right: 10, bottom: 120, left: 120 },
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    d3.select("#barChart").select("svg").remove();    
    // Append the svg object to the body of the page
    const svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.track_name))  // Use 'track_name' for the x-axis
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("fill", "orange");  // Change label color here

    svg.selectAll(".tick line").style("stroke", "cyan");  // Change axis tick color here

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.streams)])  // Use 'streams' to set the y-axis scale
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "orange");  // Change label color here

    svg.selectAll(".tick line").style("stroke", "orange");  // Change axis tick color here

        // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "orange")
        .text("Music Streams");

    // Bars
    svg.selectAll("myBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.track_name))
        .attr("y", d => y(d.streams))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.streams))
        .attr("fill", "#1DB954")  // You can change bar color here if needed
        .on("click", function(event, d) {
            const songName = d.track_name;

                // Check if the song is already selected
            const isSelected = selectedSongs.includes(songName);
            d3.select(this).attr("fill", isSelected ? "#1DB954" : "orange");

            if (isSelected) {
                // If the song is already selected, remove it from the list
                selectedSongs = selectedSongs.filter(song => song !== songName);
            } else {
                // If the song is not selected, add it to the list
                if (selectedSongs.length < 5) {
                    selectedSongs.push(songName);
                } else {
                    // If the maximum of 5 songs is reached, alert the user
                    alert("You can only select up to 5 songs.");
                }
            }

            // Update the global state with the list of selected songs
            if(selectedSongs.length == 5) {
                console.log("SelectedSongs: ", selectedSongs)
                globalState.setFilters("track_name", selectedSongs);
            }
        });

    svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20) // Position above the top margin
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-family", "Arial")
    .style("fill", "white")
    .text("Top 20 Spotify Songs based on Streams");
}

    


