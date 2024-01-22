var checkedLabels = [];

var selectedPlot = "Recipe Type Percentages";

var plotTypeDropdown = d3.select("#plotTypeDropdown");

// Add an event listener for the 'change' event
plotTypeDropdown.on("change", function () {
    // Get the selected value
    selectedPlot = plotTypeDropdown.property("value");

    // Call different functions based on the selected value
    switch (selectedPlot) {
        case "Recipe Type Percentages":
            renderRecipesPlot();
            break;
        case "Nutrient PDV Percentages":
            renderNutrientsPlot();
            break;
        default:
            // Handle other cases if needed
            break;
    }
});

/**
 * Represents the container for the cuisine filter tree.
 * @type {Object}
 */
var container = d3.select("#cuisineFilterContainer");

/**
 * Represents a scrollable container for the list.
 * @type {Object}
 */
var scrollContainer = container
    .append("div")
    .style("max-height", "20.8vh")
    .style("overflow", "auto");

/**
 * Represents the root ul element for the cuisine filter tree.
 * @type {Object}
 */
var rootList = scrollContainer.append("ul");

/**
 * Creates a tree structure for displaying cuisines with checkboxes.
 * @function
 */
function createCuisinesTree() {
    // Iterate over cuisines
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

/**
 * Toggles the visibility of nested ul elements and checks/unchecks children checkboxes.
 * @function
 */
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

/**
 * Check Action
 * @function
 */
function checkAction() {
    checkedLabels = [];

    // Loop through all checkboxes
    rootList.selectAll("input[type='checkbox']").each(function () {
        if (this.checked) {
            checkedLabels.push(d3.select("label[for='" + this.id + "']").text());
        }
    });

    switch (selectedPlot) {
        case "Recipe Type Percentages":
            updateRecipesPlot();
            break;
        case "Nutrient PDV Percentages":
            updateNutrientsPlot();
            break;
        default:
            // Handle other cases if needed
            break;
    }
}

// Initial call to create the cuisines tree
createCuisinesTree();
