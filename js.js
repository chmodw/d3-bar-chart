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

// const barWidth = width / data.count()

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

    let scaledGDP = data.map((item) => linearScale(item.gdp));

    // data.forEach((i) => {
    //   data[i].barHeight = linearScale(item.gdp);
    // });

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

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => data[i].date)
      .attr("data-gdp", (d, i) => data[i].gdp)
      .attr("class", "bar")
      .attr("y", (d) => height - d)
      .attr("x", (d, i) => xScale(data[i].date))
      .attr("width", width / 275)
      .attr("height", (d) => d)
      .attr("transform", "translate(60, 0)")
      .style("fill", "#33adff");
  })
  .catch((error) => {
    if (error) throw error;
  });

/**
 * @param {object} data
 * @return {year : "", gdp : "", quarter : ""}
 */
function modifier(data) {
  let modified = data.map((item) => {
    return {
      date: new Date(item[0]),
      year: parseInt(item[0].substring(0, 4)),
      gdp: parseFloat(item[1]),
      quarter: getQuarters(item[0]),
      barHeight: 0,
    };
  });

  return modified;
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

// /**
//  * add x and y scales
//  */
// let xScale = d3
//   .scaleTime()
//   .domain([
//     d3.min(data.map((item) => item.date)),
//     d3.max(data.map((item) => item.date)),
//   ])
//   .range([0, width]);

// let yScale = d3
//   .scaleLinear()
//   .domain([0, d3.max(data.map((item) => item.gdp))])
//   .range([height, 0]);

// let xAxis = d3.axisBottom().scale(xScale);
// var yAxis = d3.axisLeft(yScale);

// chartContainer
//   .append("g")
//   .call(xAxis)
//   .attr("id", "x-axis")
//   .attr("transform", "translate(60, 400)");

// chartContainer
//   .append("g")
//   .call(yAxis)
//   .attr("id", "y-axis")
//   .attr("transform", "translate(60, 0)");

// /**
//  *
//  * Change this later
//  *
//  */
// var linearScale = d3
//   .scaleLinear()
//   .domain([0, d3.max(data.map((item) => item.gdp))])
//   .range([0, height]);

// /**
//  * add chart bars
//  */
// d3.select("svg")
//   .selectAll("rect")
//   .data(
//     data
//       .map((d) => d.gdp)
//       .map((d) => {
//         linearScale(d);
//       })
//   )
//   .enter()
//   .append("rect")
//   .attr("class", "bar")
//   .attr("data-date", data.date)
//   .attr("data-gdp", data.gdp)
//   .attr("x", 0)
//   .attr("y", function (d) {
//     return height - d;
//   })
//   .attr("width", width / 275)
//   .attr("height", function (d) {
//     return d;
//   })
//   .style("fill", "#33adff")
//   .attr("transform", "translate(60, 0)");
