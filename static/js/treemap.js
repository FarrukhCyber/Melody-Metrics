async function fetchKeyDistr() {
    const response = await fetch("/treemap");
    const data = await response.json();
    return data;
}

export async function createTreemap() {
    const data = await fetchKeyDistr();
    const width = 200;  // Overall width of the SVG
    const height = 600; // Overall height of the SVG
    // data.sort((a, b) => b.count - a.count); // Sort by count descending

    const svg = d3.select('#treemap').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('font', '12px sans-serif');

    const total = data.reduce((sum, item) => sum + item.count, 0); // Total counts of all keys

    let accumulatedHeight = 0;

    data.forEach(d => {
        const barHeight = (d.count / total) * height; // Calculate proportional height
        svg.append('rect')
            .attr('x', 50) // x position
            .attr('y', accumulatedHeight) // y position
            .attr('width', width - 100) // width of each bar
            .attr('height', barHeight) // height based on proportion
            .attr('fill', '#1DB954')
            .attr('stroke', 'black') // Dark stroke for clear boundaries
            .attr('stroke-width', '2'); // Thickness of the stroke

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', accumulatedHeight + barHeight / 2)
            .attr('dy', '0.35em')
            .text(`${d.key} (${d.count})`)
            .attr('text-anchor', 'middle')
            .style('fill', 'black');

        accumulatedHeight += barHeight; // Increment y position for the next bar
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20) // Position above the top margin
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "Arial")
        .style("fill", "white")
        .text("Keys");
    });
}