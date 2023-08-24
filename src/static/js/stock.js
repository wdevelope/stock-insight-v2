const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const xScale = d3
  .scaleTime()
  .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
  .range([0, width]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.price)])
  .range([height, 0]);

const line = d3
  .line()
  .x((d) => xScale(new Date(d.date)))
  .y((d) => yScale(d.price));

svg
  .append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 1.5)
  .attr('d', line);
