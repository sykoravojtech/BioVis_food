// geojson map data from
// https://geojson-maps.ash.ms/

// ==================================
// CHANGE CUISINE NAME TO COUNTRY NAME
// ==================================
const cuisine_country_map = {
    'angolan': 'Angola',
    'argentine': 'Argentina',
    'australian': 'Australia',
    'austrian': 'Austria',
    'belgian': 'Belgium',
    'brazilian': 'Brazil',
    'cambodian': 'Cambodia',
    'canadian': 'Canada',
    'chilean': 'Chile',
    'chinese': 'China',
    'colombian': 'Colombia',
    'costa-rican': 'Costa Rica',
    'cuban': 'Cuba',
    'czech': 'Czech Republic',
    'danish': 'Denmark',
    'ecuadorean': 'Ecuador',
    'egyptian': 'Egypt',
    'english': 'United Kingdom', 
    'ethiopian': 'Ethiopia',
    'filipino': 'Philippines',
    'finnish': 'Finland',
    'french': 'France',
    'georgian': 'Georgia',
    'german': 'Germany',
    'greek': 'Greece',
    'guatemalan': 'Guatemala',
    'hawaiian': 'United States of America', 
    'hungarian': 'Hungary',
    'indian': 'India',
    'indonesian': 'Indonesia',
    'iranian-persian': 'Iran',
    'iraqi': 'Iraq',
    'irish': 'Ireland',
    'italian': 'Italy',
    'japanese': 'Japan',
    'korean': 'South Korea',  
    'lebanese': 'Lebanon',
    'libyan': 'Libya',
    'malaysian': 'Malaysia',
    'mexican': 'Mexico',
    'mongolian': 'Mongolia',
    'moroccan': 'Morocco',
    'nepalese': 'Nepal',
    'nigerian': 'Nigeria',
    'norwegian': 'Norway',
    'pakistani': 'Pakistan',
    'palestinian': 'Palestine',
    'peruvian': 'Peru',
    'polish': 'Poland',
    'portuguese': 'Portugal',
    'puerto-rican': 'Puerto Rico',
    'russian': 'Russia',
    'scottish': 'United Kingdom', 
    'south-african': 'South Africa',
    'spanish': 'Spain',
    'swedish': 'Sweden',
    'swiss': 'Switzerland',
    'thai': 'Thailand',
    'turkish': 'Turkey',
    'vietnamese': 'Vietnam',
    'welsh': 'United Kingdom', 
    'british-columbian': 'Canada',  
    'pacific-northwest': 'United States of America', 
    'quebec': 'Canada',  
    'southern-united-states': 'United States of America',
    'southwestern-united-states': 'United States of America',
    'american': 'United States of America',
}

function transformCuisineToCountry(data, keymap) {
    let transformedData = {};
    for (let cuisine in data) {
        if (keymap.hasOwnProperty(cuisine)) {
            transformedData[keymap[cuisine]] = data[cuisine];
        }
    }
    return transformedData;
}

let ingredientData = transformCuisineToCountry(dataArray, cuisine_country_map);

// ==================================
// TOOLTIP
// ==================================

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
const countryData = ingredientData[d.properties.name];
let tooltipHtml = "Country: <strong>" + d.properties.name + "</strong><br><table>";

if (typeof countryData === 'object' && countryData !== null) {
    const topIngredients = Object.entries(countryData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    topIngredients.forEach((ingredient, index) => {
        if (index === 0) { // Check if it's the first row
        tooltipHtml += "<tr><td><strong>" + (index + 1) + ": " + ingredient[0] + "</strong></td><td><strong>= " + ingredient[1].toFixed(2) + "%</strong></td></tr>";
        } else {
            tooltipHtml += "<tr><td>" + (index + 1) + ": " + ingredient[0] + "</td><td>= " + ingredient[1].toFixed(2) + "%</td></tr>";
        }
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
        "butter": "#FFD700",
        "soy sauce": "#3F250B",
        "olive oil": "#9A9738",
        "onion": "#9955BB",
        "tomatoes": "#FF6347",
        "fish sauce": "#8B572A",
        "garlic": "#878484",
        "turmeric": "#ff9e0c",
        "oil": "#D1C45A",
        "salt": "#CCCCCC",
        "water": "#7EB6FF",
        "sugar": "#F0F0F0",
        "sour cream": "#ebddae",
        // Add more mappings as needed
    };
    return colors[ingredient] || "#eee"; // Default color for unknown ingredients
};

function getMaxKey(ingredients) {
let maxKey = Object.keys(ingredients).reduce((a, b) => ingredients[a] > ingredients[b] ? a : b);
return maxKey
};

function blueColorScale(value, minValue, maxValue) {
// Create a sequential color scale with blue color
const scale = d3.scaleSequential(d3.interpolateBlues)
                .domain([minValue, maxValue]);

return scale(value);
}


// ==================================
// MAP 1: Top ingredient color
// ==================================
MAP_X = 1100
MAP_Y = 500

// Load the GeoJSON data for the world map
d3.json("../static/plot1/countries_world.json").then(function(world) {
console.log("World map loaded", world);
// var svg = d3.select("#world-map");
var svg = d3.select("#world-map").attr("viewBox", "0 0 " + MAP_X + " " + MAP_Y);
var projection = d3.geoMercator().fitSize([MAP_X, MAP_Y], world);
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
        console.log("maxkey = " + maxKey + ": " + ingredients[maxKey]);
        return colorBasedOnIngredient(maxKey);
    }       
    return colorBasedOnIngredient("null")
    })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
}).catch(function(error) {
    console.error("Error loading the world map:", error);
});


// ==================================
// MAP 2: Top ingredient percentage
// ==================================

// Load the GeoJSON data for the world map (assuming it's already loaded for the first map)
d3.json("../static/plot1/countries_world.json").then(function(world) {
// Create SVG for the second world map
var svg2 = d3.select("#world-map2").attr("viewBox", "0 0 " + MAP_X + " " + MAP_Y);
var projection2 = d3.geoMercator().fitSize([MAP_X, MAP_Y], world);
var path2 = d3.geoPath().projection(projection2);

// Find min and max values for the ingredients to set the domain for the color scale
let allValues = [];
Object.values(ingredientData).forEach(countryIngredients => {
    Object.values(countryIngredients).forEach(value => {
    allValues.push(value);
    });
});
let minValue = Math.min(...allValues);
let maxValue = Math.max(...allValues);
// console.log("MIN VAL:" + minValue)
// console.log("MAX VAL:" + maxValue)

// Create a sequential color scale with blue color
const blueColorScale = d3.scaleSequential(d3.interpolateBlues)
                            .domain([0, maxValue]);

// Draw the countries with shades of blue for the second map
svg2.selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("d", path2)
    .attr("fill", function(d) {
    var country = d.properties.name;
    var ingredients = ingredientData[country];
    if (typeof ingredients !== 'undefined') {
        let maxKey = getMaxKey(ingredients);
        return blueColorScale(ingredients[maxKey]);
    }
    return blueColorScale(0.5); // Default color for countries with no data
    })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

// Create a defs element to define the gradient
var defs = svg2.append("defs");

var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("gradientUnits", "userSpaceOnUse") // Set the gradient units
    .attr("x1", "0%")
    .attr("y1", "100%") // Start from the bottom
    .attr("x2", "0%")
    .attr("y2", "0%"); // Go to the top

linearGradient.selectAll("stop")
    .data(blueColorScale.ticks().map((tick, i, nodes) => ({ offset: `${100*i/nodes.length}%`, color: blueColorScale(tick) })))
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

// Legend dimensions and position
var legendHeight = 200;
var legendWidth = 15;
var legendPosition = { x: 1000, y: 100 }; // Position on the right side

// Create the legend rectangle
svg2.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)")
    .attr("transform", `translate(${legendPosition.x},${legendPosition.y})`);

// Create a scale for the legend
var legendScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([legendHeight, 0]); // Range is reversed for a bottom-to-top axis

// Create a vertical axis for the legend
var legendAxis = d3.axisRight(legendScale)
    .ticks(5); // Adjust the number of ticks as needed

// Add the legend axis
svg2.append("g")
    .attr("transform", `translate(${legendPosition.x + legendWidth},${legendPosition.y})`)
    .call(legendAxis);

// Position for the label (above the legend)
var labelX = legendPosition.x + legendWidth / 2; // Horizontally centered above the legend
var labelY = legendPosition.y - 10; // Slightly above the top of the legend

// Add the label
svg2.append("text")
    .attr("x", labelX)
    .attr("y", labelY)
    .attr("text-anchor", "middle") // Centers the text horizontally around (x, y)
    .style("font-size", "12px") // Adjust the font size as needed
    .text("% use of Ingredient"); // Replace with your desired label text


}).catch(function(error) {
    console.error("Error loading the world map:", error);
});
