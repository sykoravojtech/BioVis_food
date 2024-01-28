// ===================
// Cuisine Tree: Initialization
// ===================
var container = d3.select("#cuisineFilterContainer");
var scrollContainer = container
    .append("div")
    .style("max-height", "70vh")
    .style("overflow", "auto");
var rootList = scrollContainer.append("ul");

// ===================
// Cuisine Tree: Functions
// ===================
function createCuisinesTree() {
    for (var continent in cuisines) {
        if (cuisines.hasOwnProperty(continent)) {
            var continentItem = rootList.append("li");

            // Create checkbox for continent
            continentItem
                .append("input")
                .attr("type", "checkbox")
                .attr("id", continent + "Checkbox")
                .attr("class", "parentCheckbox")
                .on("change", toggleChildren);

            // Create label for continent
            continentItem
                .append("label")
                .attr("for", continent + "Checkbox")
                .text(continent);

            // Create a ul for countries within each continent
            var countryList = continentItem.append("ul").style("display", "none");

            // Iterate over countries
            for (var i = 0; i < cuisines[continent].length; i++) {
                var countryItem = countryList.append("li");

                // Create checkbox for country
                countryItem
                    .append("input")
                    .attr("type", "checkbox")
                    .attr("id", continent + "_" + i + "Checkbox")
                    .attr("class", "childCheckbox")
                    .on("change", checkAction);

                // Create label for country
                countryItem
                    .append("label")
                    .attr("for", continent + "_" + i + "Checkbox")
                    .text(cuisines[continent][i]);
            }
        }
    }
}

function toggleChildren() {
    var parentDiv = d3.select(this.parentNode);
    var childCheckboxes = parentDiv.selectAll("ul input.childCheckbox");
    var childUl = parentDiv.select("ul");

    if (this.checked) {
        // Check all child checkboxes
        childCheckboxes.property("checked", true).style("display", "inline-block");
        childUl.style("display", "block");
    } else {
        // Uncheck all child checkboxes
        childCheckboxes.property("checked", false).style("display", "none");
        childUl.style("display", "none");
    }

    checkAction();
}

function checkAction() {
    checkedLabels = [];

    // Loop through all checkboxes
    rootList.selectAll("input[type='checkbox']").each(function () {
        if (this.checked) {
            checkedLabels.push(d3.select("label[for='" + this.id + "']").text());
        }
    });

    switch (selectedPlot) {
        case "Recipe Types":
            updateRecipesPlot();
            break;
        case "Nutrient PDV":
            updateNutrientsPlot();
            break;
        case "Calories":
            updateCaloriesPlot();
            break;
        default:
            break;
    }
}

// ===================
// Cuisine Tree: Initial Call
// ===================
createCuisinesTree();

// ===================
// Recipe Types Plot: Dimensions and Scales
// ===================
let { clientWidth: containerWidth, clientHeight: containerHeight } =
    document.getElementById("centerContainer");
let recipesBarHeight = (window.innerHeight * 0.8) / dataset.length;
let recipesSvgWidth = window.innerWidth * 0.45;
let recipesSvgHeight = dataset.length * recipesBarHeight;
let recipesScaleX = d3.scaleLinear().domain([0, 100]).range([0, recipesSvgWidth]);
let recipesScaleY = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([0, recipesSvgHeight]);

// ===================
// Tool Tip
// ===================

const tooltip = d3
    .select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

// ===================
// Tool Tip: Functions
// ===================

const showTooltip = function (event, tooltipHtml) {
    tooltip
        .style("opacity", 0)
        .html(tooltipHtml)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
};

const moveTooltip = function () {
    tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY + 10 + "px");
};
const hideTooltip = function () {
    tooltip.transition().duration(200).style("opacity", 0);
};

// ===================
// Recipe Types Plot: Functions
// ===================
function renderRecipesPlot() {
    // Removing existing elements in the plot
    d3.select("#plot").selectAll("*").remove();
    const svg = d3.select("#plot");

    // Setting margins for better visualization
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };

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
    svg.append("g")
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
        .attr("fill", "#2ca25f")
        .on("mouseover", function (event, d) {
            var tooltipHtml =
                d[0] +
                " Cuisine - " +
                d[3] +
                " Vegan Recipes (" +
                ((d[3] / d[2]) * 100).toFixed(1) +
                "%)";
            showTooltip(event, tooltipHtml);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", displayCuisineDetails)
        .style("cursor", "pointer");

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
        .attr("fill", "#99d8c9")
        .on("mouseover", function (event, d) {
            var tooltipHtml =
                d[0] +
                " Cuisine - " +
                d[4] +
                " Vegetarian Recipes (" +
                ((d[4] / d[2]) * 100).toFixed(1) +
                "%)";
            showTooltip(event, tooltipHtml);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", displayCuisineDetails)
        .style("cursor", "pointer");

    // Appending bars for 'regular' category
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "regular")
        .attr("x", function (d) {
            return recipesScaleX((d[3] / d[2]) * 100 + (d[4] / d[2]) * 100);
        })
        .attr("y", function (d, i) {
            return i * recipesBarHeight;
        })
        .attr("height", recipesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0]))
                return recipesScaleX(100 - (d[3] / d[2]) * 100 - (d[4] / d[2]) * 100);
            else return 0;
        })
        .attr("fill", "#e5f5f9")
        .on("mouseover", function (event, d) {
            var tooltipHtml =
                d[0] +
                " Cuisine - " +
                (d[2] - d[3] - -d[4]) +
                " Regular Recipes (" +
                (100 - (d[3] / d[2]) * 100 - (d[4] / d[2]) * 100).toFixed(1) +
                "%)";
            showTooltip(event, tooltipHtml);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", displayCuisineDetails)
        .style("cursor", "pointer");
}

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

    // Transition for 'regular' category bars
    svg.transition()
        .duration(500)
        .selectAll("rect.regular")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0]))
                return recipesScaleX(100 - (d[3] / d[2]) * 100 - (d[4] / d[2]) * 100);
            else return 0;
        });
}

// ===================
// Recipe Types Plot: Initial Rendering
// ===================
renderRecipesPlot();

// ===================
// Nutrients Plot: Color and Index Maps
// ===================
var labelColorMap = {
    "Total Fat": "#1f78b4",
    Sugar: "#fdbf6f",
    Sodium: "#6a3d9a",
    Protein: "#e31a1c",
    "Saturated Fat": "#a6cee3",
    Carbohydrates: "#ff7f00",
};

var labelIndexMap = {
    "Total Fat": 16,
    Sugar: 17,
    Sodium: 18,
    Protein: 19,
    "Saturated Fat": 20,
    Carbohydrates: 21,
};

// ===================
// Nutrients Plot: Dimensions and Scales
// ===================
let nutrientsBarHeight = (window.innerHeight * 0.8) / dataset.length;
let nutrientsSvgWidth = window.innerWidth * 0.45;
let nutrientsSvgHeight = dataset.length * nutrientsBarHeight;
let nutrientsScaleX = d3.scaleLinear().domain([0, 130]).range([0, nutrientsSvgWidth]);
let nutrientsScaleY = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([0, nutrientsSvgHeight]);

// ===================
// Nutrients Plot: Functions
// ===================
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

    // Appending nutrient bars
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "nutrient")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * nutrientsBarHeight;
        })
        .attr("height", nutrientsBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) {
                return nutrientsScaleX(
                    d[labelIndexMap[d3.select("#nutrientTypeDropdown").property("value")]]
                );
            } else return 0;
        })
        .attr("fill", function (d) {
            const alpha =
                d[labelIndexMap[d3.select("#nutrientTypeDropdown").property("value")]] /
                100;

            const hexColor =
                labelColorMap[d3.select("#nutrientTypeDropdown").property("value")];
            const rgbaColor = d3.color(hexColor).copy({ opacity: alpha }).toString();

            return rgbaColor;
        })
        .on("mouseover", function (event, d) {
            nutrient = d3.select("#nutrientTypeDropdown").property("value");
            var tooltipHtml =
                d[0] +
                " Cuisine - " +
                nutrient +
                " PDV: " +
                d[labelIndexMap[nutrient]].toFixed(1) +
                "%";
            showTooltip(event, tooltipHtml);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", displayCuisineDetails)
        .style("cursor", "pointer");
}

function updateNutrientsPlot() {
    // Selecting the SVG container
    const svg = d3.select("#plot");

    // Transition for nutrient bars
    svg.transition()
        .duration(500)
        .selectAll("rect.nutrient")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0]))
                return nutrientsScaleX(
                    d[labelIndexMap[d3.select("#nutrientTypeDropdown").property("value")]]
                );
            else return 0;
        })
        .attr("fill", function (d) {
            const alpha =
                d[labelIndexMap[d3.select("#nutrientTypeDropdown").property("value")]] /
                100;

            const hexColor =
                labelColorMap[d3.select("#nutrientTypeDropdown").property("value")];
            const rgbaColor = d3.color(hexColor).copy({ opacity: alpha }).toString();

            return rgbaColor;
        });
}

// ===================
// Calories Plot: Dimensions and Scales
// ===================
let caloriesBarHeight = (window.innerHeight * 0.8) / dataset.length;
let caloriesSvgWidth = window.innerWidth * 0.45;
let caloriesSvgHeight = dataset.length * caloriesBarHeight;
let caloriesScaleX = d3.scaleLinear().domain([0, 1400]).range([0, caloriesSvgWidth]);
let caloriesScaleY = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([0, caloriesSvgHeight]);

// ===================
// Calories Plot: Functions
// ===================
function renderCaloriesPlot() {
    // Removing existing elements in the plot
    d3.select("#plot").selectAll("*").remove();
    const svg = d3.select("#plot");

    // Setting margins for better visualization
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };

    // Setting SVG dimensions with margins
    svg.attr("width", caloriesSvgWidth + margin.left + margin.right).attr(
        "height",
        caloriesSvgWidth + margin.top + margin.bottom
    );

    // Appending X-axis with bottom alignment and adjusting font size
    svg.append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + (caloriesSvgHeight + margin.top) + ")"
        )
        .call(d3.axisBottom(caloriesScaleX))
        .selectAll("text")
        .attr("font-size", "16px");

    // Appending Y-axis with left alignment and adjusting font size
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.axisLeft(caloriesScaleY))
        .selectAll("text")
        .attr("font-size", "14.5px");

    // Appending q10 bars
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "q10")
        .attr("x", function (d, i) {
            return caloriesScaleX(d[12]);
        })
        .attr("y", function (d, i) {
            return i * caloriesBarHeight;
        })
        .attr("height", caloriesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return 2;
            else return 0;
        })
        .attr("fill", "gray");

    // Appending q90 bars
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "q90")
        .attr("x", function (d, i) {
            return caloriesScaleX(d[15]);
        })
        .attr("y", function (d, i) {
            return i * caloriesBarHeight;
        })
        .attr("height", caloriesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return 2;
            else return 0;
        })
        .attr("fill", "gray");

    // Appending q2575 bars
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "q2575")
        .attr("x", function (d, i) {
            return caloriesScaleX(d[13]);
        })
        .attr("y", function (d, i) {
            return i * caloriesBarHeight;
        })
        .attr("height", caloriesBarHeight - 2)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return caloriesScaleX(d[14] - d[13]);
            else return 0;
        })
        .attr("fill", "gray")
        .on("mouseover", function (event, d) {
            var tooltipHtml = d[0] + " Cuisine - Median: " + d[8] + " - Mean: " + d[9];
            showTooltip(event, tooltipHtml);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", displayCuisineDetails)
        .style("cursor", "pointer");

    // Appending line bars
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "line")
        .attr("x", function (d, i) {
            return caloriesScaleX(d[12]);
        })
        .attr("y", function (d, i) {
            return i * caloriesBarHeight + caloriesBarHeight / 2 - 1.5;
        })
        .attr("height", 1)
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return caloriesScaleX(d[15] - d[12]);
            else return 0;
        })
        .attr("fill", "gray");
}

function updateCaloriesPlot() {
    // Selecting the SVG container
    const svg = d3.select("#plot");

    // Transition for q10 bars
    svg.transition()
        .duration(500)
        .selectAll("rect.q10")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return 2;
            else return 0;
        });

    // Transition for q90 bars
    svg.transition()
        .duration(500)
        .selectAll("rect.q90")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return 2;
            else return 0;
        });

    // Transition for q2575 bars
    svg.transition()
        .duration(500)
        .selectAll("rect.q2575")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return caloriesScaleX(d[14] - d[13]);
            else return 0;
        });

    // Transition for line bars
    svg.transition()
        .duration(500)
        .selectAll("rect.line")
        .attr("width", function (d) {
            if (checkedLabels.includes(d[0])) return caloriesScaleX(d[15] - d[12]);
            else return 0;
        });
}

// ===================
// Plot Selection: Initialization
// ===================
var selectedPlot = "Recipe Types";
var plotTypeDropdown = d3.select("#plotTypeDropdown");
var nutrientTypeDropdown = d3.select("#nutrientTypeDropdown");
var nutrientTypeTitle = d3.select("#nutrientTypeTitle");

// ===================
// Plot Selection: Event Listeners
// ===================
plotTypeDropdown.on("change", plotTypeChangeAction);
nutrientTypeDropdown.on("change", updateNutrientsPlot);

// ===================
// Plot Selection: Functions
// ===================
function plotTypeChangeAction() {
    // Get the selected value
    selectedPlot = plotTypeDropdown.property("value");

    // Call different functions based on the selected value
    switch (selectedPlot) {
        case "Recipe Types":
            renderRecipesPlot();
            break;
        case "Nutrient PDV":
            renderNutrientsPlot();
            break;
        case "Calories":
            renderCaloriesPlot();
            break;
        default:
            // Handle other cases if needed
            break;
    }

    // Toggle visibility of nutrientTypeDropdown based on the selected plot type
    // Check if the selected plot type is "Nutrient PDV"
    if (selectedPlot === "Nutrient PDV") {
        nutrientTypeDropdown.style("display", "block"); // Show the nutrient dropdown
        nutrientTypeTitle.style("display", "block");
    } else {
        nutrientTypeDropdown.style("display", "none"); // Hide the nutrient dropdown
        nutrientTypeTitle.style("display", "none");
    }
}

// ===================
// Plot Selection: Initial Call
// ===================
plotTypeChangeAction();

// ===================
// Cuisine Details: Functions
// ===================

function displayCuisineDetails(event, d) {
    // Assuming you have paragraph elements with IDs "cuisine-name", "avg-steps-value", etc.
    let cuisineNameParagraph = d3.select("#cuisine-name-value");
    let numRecipesParagraph = d3.select("#num-recipes-value");
    let avgCaloriesParagraph = d3.select("#avg-calories-value");
    let avgStepsParagraph = d3.select("#avg-steps-value");
    let avgMinutesParagraph = d3.select("#avg-minutes-value");
    let avgIngredientsParagraph = d3.select("#avg-ingredients-value");

    // Update the paragraph elements with data from the clicked item
    cuisineNameParagraph.transition().text(d[0] + " Cuisine");
    numRecipesParagraph.transition().text(d[2] + " Recipes");
    avgCaloriesParagraph.transition().text(d[9] + " Calories");
    avgStepsParagraph.transition().text(d[5] + " Steps");
    avgMinutesParagraph.transition().text(d[6] + " Minutes");
    avgIngredientsParagraph.transition().text(d[7] + " Ingredients");
}
