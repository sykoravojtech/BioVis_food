// Calculating bar height based on the window size and dataset length
let nutrientsBarHeight = (window.innerHeight * 0.8) / dataset.length;

// Calculating SVG dimensions based on window size and bar height
let nutrientsSvgWidth = window.innerWidth * 0.45;
let nutrientsSvgHeight = dataset.length * nutrientsBarHeight;

// Creating scales for X and Y axes using D3
let maxValX = d3.max(dataset, (d) => d[22]);
let nutrientsScaleX = d3.scaleLinear().domain([0, maxValX]).range([0, nutrientsSvgWidth]);
let nutrientsScaleY = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([0, nutrientsSvgHeight]);

function renderNutrientsPlot() {
    // Removing existing elements in the plot
    d3.select("#plot").selectAll("*").remove();
    const svg = d3.select("#plot");

    // Setting margins for better visualization
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };

    // Setting SVG dimensions with margins
    svg.attr("width", nutrientsSvgWidth + margin.left + margin.right).attr(
        "height",
        nutrientsSvgWidth + margin.top + margin.bottom
    );

    // Appending X-axis with bottom alignment and adjusting font size
    svg.append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + (nutrientsSvgHeight + margin.top) + ")"
        )
        .call(d3.axisBottom(nutrientsScaleX))
        .selectAll("text")
        .attr("font-size", "16px");

    // Appending Y-axis with left alignment and adjusting font size
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.axisLeft(nutrientsScaleY))
        .selectAll("text")
        .attr("font-size", "14.5px");

    // Appending bars for 'totalFat' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "totalFat")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[16]);
            else return 0;
        })
        .attr("fill", "darkblue");

    // Appending bars for 'sugar' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "sugar")
        .attr("x", function (d) {
            return nutrientsScaleX(d[16]);
        })
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[17]);
            else return 0;
        })
        .attr("fill", "brown");

    // Appending bars for 'sodium' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "sodium")
        .attr("x", function (d) {
            return nutrientsScaleX(d[16] + d[17]);
        })
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[18]);
            else return 0;
        })
        .attr("fill", "green");

    // Appending bars for 'protein' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "protein")
        .attr("x", function (d) {
            return nutrientsScaleX(d[16] + d[17] + d[18]);
        })
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[19]);
            else return 0;
        })
        .attr("fill", "orange");

    // Appending bars for 'sturatedFat' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "saturatedFat")
        .attr("x", function (d) {
            return nutrientsScaleX(d[16] + d[17] + d[18] + d[19]);
        })
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[20]);
            else return 0;
        })
        .attr("fill", "purple");

    // Appending bars for 'carbohydrates' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "carbohydrates")
        .attr("x", function (d) {
            return nutrientsScaleX(d[16] + d[17] + d[18] + d[19] + d[20]);
        })
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[21]);
            else return 0;
        })
        .attr("fill", "gray");
}

function updateNutrientsPlot() {
    console.log(checkedLabels);
    // Selecting the SVG container
    const svg = d3.select("#plot");

    // Transition for 'totalFat' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.totalFat")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[16]);
            else return 0;
        });

    // Transition for 'sugar' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.sugar")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[17]);
            else return 0;
        });

    // Transition for 'sodium' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.sodium")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[18]);
            else return 0;
        });

    // Transition for 'protein' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.protein")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[19]);
            else return 0;
        });

    // Transition for 'saturatedFat' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.saturatedFat")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[20]);
            else return 0;
        });

    // Transition for 'carbohydrates' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.carbohydrates")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return nutrientsScaleX(d[21]);
            else return 0;
        });
}
