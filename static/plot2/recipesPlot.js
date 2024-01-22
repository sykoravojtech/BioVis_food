// Extracting container dimensions
let { clientWidth: containerWidth, clientHeight: containerHeight } =
    document.getElementById("centerContainer");

// Calculating bar height based on the window size and dataset length
let recipesBarHeight = (window.innerHeight * 0.8) / dataset.length;

// Calculating SVG dimensions based on window size and bar height
let recipesSvgWidth = window.innerWidth * 0.45;
let recipesSvgHeight = dataset.length * recipesBarHeight;

// Creating scales for X and Y axes using D3
let recipesScaleX = d3.scaleLinear().domain([0, 100]).range([0, recipesSvgWidth]);
let recipesScaleY = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([0, recipesSvgHeight]);

// Function to render the initial plot
function renderRecipesPlot() {
    // Removing existing elements in the plot
    d3.select("#plot").selectAll("*").remove();
    const svg = d3.select("#plot");

    // Setting margins for better visualization
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };

    // Setting SVG dimensions with margins
    svg.attr("width", recipesSvgWidth + margin.left + margin.right).attr(
        "height",
        recipesSvgHeight + margin.top + margin.bottom
    );

    // Appending X-axis with bottom alignment and adjusting font size
    svg.append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + (recipesSvgHeight + margin.top) + ")"
        )
        .call(d3.axisBottom(recipesScaleX))
        .selectAll("text")
        .attr("font-size", "16px");

    // Appending Y-axis with left alignment and adjusting font size
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.axisLeft(recipesScaleY))
        .selectAll("text")
        .attr("font-size", "14.5px");

    // Appending bars for 'vegan' category
    vegan = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "vegan")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * recipesBarHeight;
        })
        .attr("height", recipesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return recipesScaleX((d[3] / d[2]) * 100);
            else return 0;
        })
        .attr("fill", "darkgreen");

    // Appending bars for 'vegetarian' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "vegetarian")
        .attr("x", function (d) {
            return recipesScaleX((d[3] / d[2]) * 100);
        })
        .attr("y", function (d, i) {
            return i * recipesBarHeight;
        })
        .attr("height", recipesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return recipesScaleX((d[4] / d[2]) * 100);
            else return 0;
        })
        .attr("fill", "lightgreen");
}

// Function to update the plot with transitions
function updateRecipesPlot() {
    // Selecting the SVG container
    const svg = d3.select("#plot");

    // Transition for 'vegan' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.vegan")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return recipesScaleX((d[3] / d[2]) * 100);
            else return 0;
        });

    // Transition for 'vegetarian' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.vegetarian")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return recipesScaleX((d[4] / d[2]) * 100);
            else return 0;
        });
}

// Initial rendering of the plot
renderRecipesPlot();
