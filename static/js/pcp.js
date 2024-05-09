async function fetchPCPData(platform) {
    // console.log("Sending K_value:", k_value);
    const response = await fetch("/pcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({platform: platform }),
    });
    const data = await response.json();
    console.log("CHECK:", data);
    return data;
}

export async function createParallelCoordinatesPlot(platform) {
    console.log("creating PCP");
    var data = await fetchPCPData(platform);

    if (platform == 'playlist'){
        var orderedDimensions = ['in_spotify_playlists', 'in_apple_playlists', 'in_deezer_playlists'];
    }
    else{
        var orderedDimensions = ['in_spotify_charts', 'in_apple_charts', 'in_deezercharts', 'in_shazam_charts'];

    }

    const width = 700,
    height = 250;
    const margin = { top: 50, right: 80, bottom: 60, left: 60 };

    let isBrushing = false;

    // append the svg object to the body of the page
    d3.select("#pcp").html("");
    var svg = d3
    .select("#pcp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    var dimensions = orderedDimensions;

    console.log("dimensions:", dimensions);

    var y = {};

    // Creating a scale for each dimension
    dimensions.forEach(function (d) {
    y[d] = d3
        .scaleLinear()
        .domain(
        d3.extent(data, function (p) {
            return +p[d];
        })
        )
        .range([height, 0]);
    });
    var x = d3.scalePoint().range([0, width]).domain(dimensions);

    // ===========================================================
    //          REORDERING OF AXIS USING DRAG CODE
    // ===========================================================

    function dragstarted(event, d) {
    // if (isBrushing) return;
    d3.select(this).raise();
    this.classList.add("active"); // Add an active class to the element being dragged
    }

    function dragged(event, d) {
    // if (isBrushing) return;
    d3.select(this).attr("transform", `translate(${event.x},0)`);
    svg.selectAll(".line").attr("opacity", 0.1); 
    // Find the new position of the axis based on the drag event
    var draggedPos = event.x;
    var newPos = Math.min(
        width - margin.right,
        Math.max(margin.left, draggedPos)
    );

    // Swap position of axes that have been passed by the dragging
    var draggedIdx = dimensions.indexOf(d);
    dimensions.forEach((p, i) => {
        if (
        (x(p) < newPos && i > draggedIdx) ||
        (x(p) > newPos && i < draggedIdx)
        ) {
        dimensions[draggedIdx] = dimensions[i];
        dimensions[i] = d;
        draggedIdx = i;
        x.domain(dimensions); // Update the domain of the x scale
        }
    });

    // Update position of all axes
    svg
        .selectAll(".axis")
        .attr("transform", (dimension) => `translate(${x(dimension)},0)`);
    }

    function dragended(event, d) {
    // if (isBrushing) return;
    d3.select(this).classed("active", false); // Remove the active class from the element being dragged
    svg.selectAll(".line").attr("opacity", 0.5); // Restore the opacity of lines

    // Snap the axis to the correct position
    d3.select(this)
        .transition()
        .duration(500)
        .attr("transform", `translate(${x(d)},0)`);

    svg.selectAll(".line").transition().duration(500).attr("d", path); // Redraw the lines based on the updated axis positions
    }

    // Draw the axis with drag behavior
    svg
    .selectAll(".axis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "axis")
    .attr("id", function (d) {
        return "axis-" + d.replace(/ /g, "_");
    }) // Unique ID for each axis
    .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
    })
    .each(function (d) {
        d3.select(this).call(d3.axisLeft().scale(y[d]))
          .selectAll("text")
          .style("fill", "white"); 
    })
    .call(
        d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .append("text")
    .style("text-anchor", "start")
    .attr("y", -4)
    .attr("x", -50)
    .attr("transform", "rotate(-10)")
    .text(function (d) {
        return d;
    })
    .style("font-size", "10px")
    .style("fill", "white")
    .style("cursor", "move");

       // Change the color of the axis lines
    svg.selectAll(".axis line, .axis path")
       .style("stroke", "white"); // set axis lines color to white

    // ===========================================================

    // ==========================================================
    //              ADDING BRUSHABLE FEATURES
    // ==========================================================

    const filters = {};

    // Adjusting the brush setup to correctly associate each brush with its dimension
    dimensions.forEach(dimension => {
        const brush = d3.brushY()
            .extent([[-8, 0], [8, height - margin.top - margin.bottom]]) // Adjusted for proper alignment
            .on("brush end", function(event) { brushed(event, dimension); });
        svg.select(`#axis-${dimension.replace(/ /g, "_")}`)
            .append("g")
            .attr("class", "brush")
            .call(brush);
    });


    function brushStarted(event) {
    isBrushing = true; // Set flag to true when brushing starts
    console.log("isbrushing updated inside brushStarted", isBrushing)
    }

    // Brush event handler updated to reference the correct dimension
    function brushed(event, dimension) {

        if (event.selection) {
            isBrushing = true;
            console.log("isbrushing updated inside brushed ", isBrushing)

            const [y1, y2] = event.selection.map(y[dimension].invert, y[dimension]);
            filters[dimension] = [Math.min(y1, y2), Math.max(y1, y2)]; // Ensuring proper order
        } else {
            
        delete filters[dimension];
        }
        applyFilters();
    }

    function brushEnded(event) {
    console.log("isbrushing updated inside brushEnded", isBrushing)
    if (!event.selection) {
        isBrushing = false; // Reset flag when brushing ends
        // Handle clearing the brush if needed
        delete filters[dimension];
        // delete filters[event.target.__data__];
        }
    applyFilters();
    }

    // Updated to filter displayed lines based on active filters
    function applyFilters() {
        svg.selectAll(".line")
            .style("display", d => dimensions.every(p => {
                if (!filters[p]) return true; 
                return filters[p][0] <= d[p] && d[p] <= filters[p][1];
            }) ? null : "none");
    }

    // ==========================================================

    function path(d) {
    return d3.line()(
        dimensions.map(function (p) {
        return [x(p), y[p](d[p])];
        })
    );
    }

 

    // Draw the lines
    svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
    .attr("class", function (d) {
        return "line " + d.cluster;
    }) // 2 class for each line: 'line' and the group name
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", (d) => color(d.cluster))
    .style("opacity", 0.5);
}
