const svg = d3.select("svg");
const margin = 200;
const width = 800;
const height = 400;

var chartContainer = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

// const barWidth = width / data.count()

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((gdpData) => {
    d3.select(".test").append("text").text("Gross Domestic Product");

    let data = modifier(gdpData.data);

    var xScale = d3
      .scaleTime()
      .domain([
        d3.min(data.map((item) => item.date)),
        d3.max(data.map((item) => item.date)),
      ])
      .range([0, width]);

    var xAxis = d3.axisBottom().scale(xScale);

    chartContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 400)");
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
      quarter: getQuarter(item[0]),
    };
  });

  return modified;
}

function getQuarter(date) {
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
