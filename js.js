const svg = d3.select("svg");
const margin = 200;
const width = 800;
const height = 400;

var chartContainer = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", width + 150)
  .attr("height", height + 100)
  .style("padding", 20);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((gdpData) => {
    let data = modifier(gdpData.data);

    /**
     * add x and y scales
     */
    let xScale = d3
      .scaleTime()
      .domain([
        d3.min(data.map((item) => item.date)),
        d3.max(data.map((item) => item.date)),
      ])
      .range([0, width]);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((item) => item.gdp))])
      .range([height, 0]);

    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft(yScale);

    let linearScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((item) => item.gdp))])
      .range([0, height]);

    chartContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 400)");

    chartContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60, 0)");

    /**
     * Adding bars to the chart
     */
    d3.select("svg")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", (d) => "bar-" + d.year + d.quarter)
      .attr("y", (d) => height - linearScale(d.gdp))
      .attr("x", (d) => xScale(d.date))
      .attr("width", width / data.length)
      .attr("height", (d) => linearScale(d.gdp))
      .attr("data-date", (d) => d.date)
      .attr("data-gdp", (d) => d.gdp)
      .style("fill", "rgb(2, 70, 2)")
      .attr("transform", "translate(60, 0)")
      .on("mouseover", (m, d) => {
        d3.select("#bar-" + d.year + d.quarter).style("fill", "#FFF");

        let tooltip = d3.select("#tooltip");

        tooltip.style("opacity", 0.9);
        tooltip.select("#tooltip-date").text(d.year + " " + d.quarter);
        tooltip.select("#tooltip-gdp").text(d.gdp);
        tooltip
          .attr("data-date", d.date)
          .style("bottom", 100 + linearScale(d.gdp) + "px")
          .style("left", xScale(d.date) + "px");
      })
      .on("mouseout", (m, d) => {
        d3.select("#bar-" + d.year + d.quarter).style("fill", "#024602");
        d3.select("#tooltip").style("opacity", 0);
      });
  })
  .catch((error) => {
    if (error) throw error;
  });

function modifier(data) {
  return data.map((item) => {
    return {
      date: new Date(item[0]),
      year: parseInt(item[0].substring(0, 4)),
      gdp: parseFloat(item[1]),
      quarter: getQuarters(item[0]),
    };
  });
}

function getQuarters(date) {
  if (date.substring(5, 7) <= 3) {
    return "Q1";
  } else if (date.substring(5, 7) <= 6) {
    return "Q2";
  } else if (date.substring(5, 7) <= 9) {
    return "Q3";
  } else {
    return "Q4";
  }
}
