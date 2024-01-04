// Assuming 'country_ingredient_map' is loaded into your script
var ingredientData = dataArray;  // This should be your 'country_ingredient_map' data
console.log(ingredientData)



// ---------------------------//
//      TOOLTIP               //
// ---------------------------//

// -1- Create a tooltip div that is hidden by default:
const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
const showTooltip = function(event, d) {
  // const countryData = ingredientData[d.properties.name]; // ingredients object/dict
  // let tooltipHtml = "Country: " + d.properties.name + "<br>";
  
  // // Check if countryData is not undefined and is an object
  // if (typeof countryData === 'object' && countryData !== null) {
  //   // Extracting top 5 ingredients and their values
  //   const topIngredients = Object.entries(countryData) // Convert object to array of [key, value] pairs
  //       .sort((a, b) => b[1] - a[1]) // Sort by value
  //       .slice(0, 5); // Take the top 5

  //   // Format the ingredients into an HTML string
  //   topIngredients.forEach((ingredient, index) => {
  //       tooltipHtml += (index + 1) + ". " + ingredient[0] + " = " + ingredient[1] + "<br>";
  //   });
  // } else {
  //     tooltipHtml += "No data available";
  // }
  const countryData = ingredientData[d.properties.name];
  let tooltipHtml = "Country: <strong>" + d.properties.name + "</strong><br><table>";

  if (typeof countryData === 'object' && countryData !== null) {
      const topIngredients = Object.entries(countryData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

      topIngredients.forEach((ingredient, index) => {
          tooltipHtml += "<tr><td>" + (index + 1) + ": " + ingredient[0] + "</td><td>= " + ingredient[1].toFixed(2) + "</td></tr>";
      });
  } else {
      tooltipHtml += "<tr><td>No data available</td></tr>";
  }

  tooltipHtml += "</table>";

  tooltip
    .style("opacity", 0)  // Start with zero opacity
    // .style("width", "140px")  // Set the initial width
    // .style("height", "120px")  // Set the initial height
    .html(tooltipHtml)
    .style("left", (event.pageX + 10) + "px")  // Center the tooltip horizontally
    .style("top", (event.pageY + 10) + "px")  // Position above the cursor

    .transition()  // Start the transition
    .duration(200)  // Set the duration of the transition
    .style("opacity", 0.9)  // Transition to full opacity
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
    .style("opacity", 0)
};

function colorBasedOnIngredient(ingredient) {
    // Define a color mapping for ingredients
    var colors = {
        "butter": "#264653", // dark blue: usa, canada
        "soy sauce": "#2a9d8f", // cyan
        "olive oil": "#e9c46a", // yellow
        "onion" : "#f4a261", // orange
        "tomatoes" : "#e76f51", // red
        "fish sauce" : "#a2d2ff", // light blue
        "garlic" : "#ffafcc", // pink
        "turmeric" : "#a3b18a", // light green
        "oil" : "#3a5a40", // dark green    MAYBE COMBINE WITH OIL?
        // Add more mappings as needed
    };
    return colors[ingredient] || "#eee"; // Default color for unknown ingredients
};

function getMaxKey(ingredients) {
  let maxKey = Object.keys(ingredients).reduce((a, b) => ingredients[a] > ingredients[b] ? a : b);
  return maxKey
};



// ---------------------------//
//          MAIN              //
// ---------------------------//

// Load the GeoJSON data for the world map
d3.json("../static/countries_world.json").then(function(world) {
  console.log("World map loaded", world);
  // var svg = d3.select("#world-map");
  var svg = d3.select("#world-map").attr("viewBox", "0 0 1200 600");
  var projection = d3.geoMercator().fitSize([1200, 600], world);
  var path = d3.geoPath().projection(projection);


  // Filter out Antarctica by checking the properties.name or other identifying feature
  var featuresWithoutAntarctica = world.features.filter(function(d) {
    return d.properties.name !== "Antarctica"; // Replace with the actual property if different
  });

  // Draw the countries
  svg.selectAll("path")
    .data(featuresWithoutAntarctica)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", function(d) {
      console.log("Processing country:", d.properties.name);
      var country = d.properties.name;
      var ingredients = ingredientData[country];
      if (typeof ingredients !== 'undefined') {
        console.log("Ingredient for " + country + ":", ingredients);
        let maxKey = getMaxKey(ingredients);
        console.log("maxkey = " + maxKey);
        return colorBasedOnIngredient(maxKey);
      }       
      return colorBasedOnIngredient("null")
    })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip)
    // THIS IS A POOR MANS TOOLTIP
    // .append("title")  // Append a title element to each path
    // .text(function(d) {
    //   var country = d.properties.name;
    //   var ingredients = ingredientData[country];
    //   if (typeof ingredients !== 'undefined') {
    //     let maxIngredient = Object.keys(ingredients).reduce((a, b) => ingredients[a] > ingredients[b] ? a : b);
    //     return country + ": " + maxIngredient + " (" + ingredients[maxIngredient] + ")";
    //   } else {
    //     return country + ": No data";
    //   }
    // })
    ;
}).catch(function(error) {
  console.error("Error loading the world map:", error);
});
