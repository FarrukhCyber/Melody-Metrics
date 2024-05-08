async function fetchTimeSeriesData() {
    const response = await fetch("/time_series");
    const data = await response.json();
    return data;
}

export async function drawTimeSeries() {
    const data = await fetchTimeSeriesData();
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    console.log(data)
    const svg = d3.select('#timeSeries').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.count = +d.count;
    });

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // Define the line
    const valueline = d3.line()
        .x(function(d) {
            console.log(d.date)
            return x(d.date); 
        })
        .y(function(d) { 
            console.log(d.count)
            return y(d.count); 
        });

    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', 'steelblue')
        .attr('fill', 'none');

    // Add the X Axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));
}