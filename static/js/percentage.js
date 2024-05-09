async function fetchPercentage(columnName, filters) {

    const response = await fetch("/get_percentage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({columnName: columnName, filters: filters}),
      });
      const data = await response.json();
      console.log("CHECK %:", data);
      return data;
}




export async function drawPercentage(columnName=NaN, filters=NaN) {
    // const percentage = await fetchPercentage(columnName, filters);
    // const { percentage } = await response.json();
    const {percentage} = await fetchPercentage(columnName, filters);

    const width = 200, height = 200, twoPi = 2 * Math.PI;
    const progress = percentage / 100;

    const arc = d3.arc()
        .startAngle(0)
        .innerRadius(60)
        .outerRadius(70);


    d3.select("#percentage").select("svg").remove();
    const svg = d3.select("#percentage").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const meter = svg.append("g")
        .attr("class", "progress-meter");

    meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(twoPi))
        .style("fill", "#ccc");

    const foreground = meter.append("path")
        .attr("class", "foreground")
        .style("fill", "#1DB954");

    const text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("font-size", "30px")
        .attr("fill", "white");

    foreground.transition()
        .duration(750)
        .attrTween("d", function() {
            const interpolate = d3.interpolate(0, progress * twoPi);
            return function(t) {
                return arc.endAngle(interpolate(t))();
            };
        });

    text.text(Math.round(percentage) + '%');
}