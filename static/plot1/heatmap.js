const margin = { top: 10, right: 50, bottom: 50, left: 130 };
allData = dataArray
// Get the size of the container
const containerWidth = document.getElementById("heat-map").clientWidth;
const containerHeight = document.getElementById("heat-map").clientHeight;

// Calculate the width and height based on the container size
const width = containerWidth - margin.left - margin.right;
const height = containerHeight - margin.top - margin.bottom;

// Use the calculated width and height to set the viewBox
const svg = d3.select("#heat-map")
  .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Assuming allData is already loaded from your Flask application
const cuisines = Object.keys(allData);
const ingredients = [...new Set(Object.values(allData).flatMap(d => Object.keys(d)))];

//  ======== SCALING AND AXES ========
const x = d3.scaleBand()
  .range([0, width])
  .domain(ingredients)
  .padding(0.05);

svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

const y = d3.scaleBand()
  .range([height, 0])
  .domain(cuisines)
  .padding(0.05);
  
svg.append("g")
    .call(d3.axisLeft(y));

const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([0, 10]); // Assuming the maximum percentage is 10


//  ======== RECTANGLE CELLS OF HEATMAP ========
Object.entries(allData).forEach(([cuisine, ingredientsData]) => {
  Object.entries(ingredientsData).forEach(([ingredient, percentage]) => {
    svg.append("rect")
      .attr("x", x(ingredient))
      .attr("y", y(cuisine))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", colorScale(percentage));
  });
});


// ======== COLOR LEGEND ========
const defs = svg.append("defs");

const linearGradient = defs.append("linearGradient")
  .attr("id", "linear-gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", "0")
  .attr("y1", height)
  .attr("x2", "0")
  .attr("y2", "0");

linearGradient.selectAll("stop")
  .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: colorScale(t) })))
  .enter().append("stop")
  .attr("offset", d => d.offset)
  .attr("stop-color", d => d.color);

const legendHeight = height / 2; // Adjust the height of the legend as needed
const legendWidth = 15; // Width of the legend bar

const colorLegend = svg.append("g")
  .attr("transform", `translate(${width + margin.right + legendWidth-10}, ${margin.top})`);

colorLegend.append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#linear-gradient)");

// ======== COLOR LEGEND AXES ========
const colorLegendScale = d3.scaleLinear()
  .domain(d3.extent(colorScale.domain())) // Use the full extent of your color scale domain
  .range([legendHeight, 0]);

const colorLegendAxis = d3.axisRight(colorLegendScale)
  .ticks(6) // Adjust the number of ticks to suit your preference
  .tickFormat(d => `${d3.format(".0f")(d)}%`); // Format the labels to zero decimal places

colorLegend.append("g")
  .call(colorLegendAxis)
  .attr("transform", `translate(${legendWidth}, 0)`)
  .selectAll("text")
  .style("text-anchor", "start")
  .style("font-size", "14px") // Adjust the font size as needed
  .attr("x", 4) // Offset text to the right of the ticks
  .attr("dy", "-0.35em"); // Adjust text position relative to tick

// Adjust the SVG viewBox if necessary to accommodate the legend text
d3.select("#heat-map svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right + legendWidth + 40} ${height + margin.top + margin.bottom}`);


// ======== TOOLTIP ========
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "black")
  .style("border", "solid 1px #aaa")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("pointer-events", "none")
  .style("color", "white");

const showTooltip = function(event, d) {
    let tooltipHtml = `Cuisine: <strong>${d.cuisine}</strong><br>Ingredient: <strong>${d.ingredient}</strong><br>Percentage: <strong>${d.percentage.toFixed(2)}%</strong>`;

    tooltip
        .html(tooltipHtml)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
};

const moveTooltip = function(event, d) {
tooltip
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px");
};

const hideTooltip = function(event, d) {
tooltip
    .transition()
    .duration(200)
    .style("opacity", 0);
};

// add a tooltip for each cell
Object.entries(allData).forEach(([cuisine, ingredientsData]) => {
    Object.entries(ingredientsData).forEach(([ingredient, percentage]) => {
      svg.append("rect")
        .attr("x", x(ingredient))
        .attr("y", y(cuisine))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", colorScale(percentage))
        .on("mouseover", function(event, d) {
          showTooltip(event, { cuisine: cuisine, ingredient: ingredient, percentage: percentage });
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);
    });
});


/*
This heatmap shows the top 5 ingredients in each cuisine and their percentage of occurence in recipes 
of such cuisine.
The most used inrgedients are the basic ones such as salt or water. If we remove these basic ingredients 
we get more into depth of what represents the cuisines of the world.
*/