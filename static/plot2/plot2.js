// ===================
// Cuisine Tree: Initialization
// ===================
var checkedLabels = [];
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
        default:
            // Handle other cases if needed
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
// Recipe Types Plot: Functions
// ===================
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
        .attr("fill", "#2ca25f");

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
        .attr("fill", "#99d8c9");

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
        .attr("fill", "#e5f5f9");
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
        });
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
