async function fetchBubbleData() {
    const response = await fetch("/bubblechart");
    const data = await response.json();
    return data;
}


export async function createBubbleChart() {
    const data = await fetchBubbleData();
    const width = 450; // Width of the SVG
    const height = 250; // Height of the SVG

    const svg = d3.select('#bubbleChart').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Sort data by count and slice to get top 10 for labeling
    data.sort((a, b) => b.count - a.count);
    const top10Genres = new Set(data.slice(0, 10).map(d => d.genre));

    const pack = d3.pack()
        .size([width, height])
        .padding(2);

    const root = d3.hierarchy({children: data})
        .sum(d => d.count); // Define the value to determine the area of the bubble

    const bubbles = pack(root).leaves();

    const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale

    svg.selectAll('circle')
        .data(bubbles)
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .style('fill', d => color(d.data.genre));

    // Append text only to the top 10 largest bubbles
    svg.selectAll('text')
        .data(bubbles.filter(d => top10Genres.has(d.data.genre)))
        .enter().append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .text(d => d.data.genre)
        .attr('dy', '.3em')
        .attr('text-anchor', 'middle')
        .style('fill', 'white')
        .style('font-size', '12px');
}