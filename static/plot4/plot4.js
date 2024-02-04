//Set variables
var ingredients = []
var selectedIngredients = []
var continents = []
var selectedContinents = []

//Get JSON file for continents
function fetchContinentsData() {
    fetch("./continents.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error
            (`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) =>
          continents = data )
    .catch((error) =>
           console.error("Unable to fetch data:", error));
    
}
// Get the selected values from the drop-down menues 
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];
        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

// When the  select, run the updateChart function
d3.select("#ingredientSelect").on("change", function(event,d) {
    
    // recover the option that has been chosen
    var selectList = document.getElementsByTagName('select')[0];
    selectedIngredients = getSelectValues(selectList);
    
    // Remove all child nodes of the svg element
    let svg = document.getElementById('ScatterPlot');
    while (svg.firstChild !== null) {
        svg.removeChild(svg.firstChild);
    }
    
    // run the updateChart function with this selected option
    updateChart()
})

d3.select("#continentSelect").on("change", function(event,d) {
    // recover the option that has been chosen
    var selectList = document.getElementsByTagName('select')[1];
    selectedContinents = getSelectValues(selectList);
    // remove all child nodes of the svg element
    let svg = document.getElementById('ScatterPlot');
    while (svg.firstChild !== null) {
        svg.removeChild(svg.firstChild);
    }
    // run the updateChart function with this selected option
    updateChart()
})

function updateChart() {
    // Load data from CSV file
    d3.csv("output_narrow_100.csv").then(d => {
        
        // Set up SVG dimensions
        var data = d
        const margin = { top: 50, right: 50, bottom: 100, left: 100 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        
        // Create SVG container
        const svg = d3.select("#ScatterPlot")

        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Extract unique ingredients
        ingredients = d3.map(data, d => d.Ingredient);
        cuisines = d3.map(data, d => d.Cuisine);
        for (let i = 0; i < data.length; i++) {
            var item = data[i];
            item.Continent = continents[item.Cuisine]
            data[i] = item
        }
        //Set the drop-down menue data
        const ingredientsDropdown = [...new Set(ingredients)];
        const continentsDropDown = ["North American",
                                    "European",
                                    "Oceanian",
                                    "Asian",
                                    "African",
                                    "South American"];
        //Use all continents if no continents were selected
        if (selectedContinents.length == 0) {
            selectedContinents = continentsDropDown;
        }
        
        //Creat drop-down with ingredients
        const dropdown1 = d3.select("#ingredientSelect");
        dropdown1.selectAll("option")
        .data(ingredientsDropdown)
        .enter().append("option")
        .text(d=>d) 
        .attr("value", d=>d ) 

         //Creat drop-down with continents
        const dropdown2 = d3.select("#continentSelect");
        dropdown2.selectAll("option")
        .data(continentsDropDown)
        .enter().append("option")
        .text(d=>d)
        .attr("value", d=>d )
        
        // Create scales for x and y axes
        const xScale = d3.scaleBand()
        .domain(selectedIngredients)
        .range([0, width])
        .padding(0.1);
        
        const yScale = d3.scaleLog()
        .domain([1, (d3.max(data, d => +d.Frequency))])
        .range([height, 1 ]);
        
        // Add x-axis
        svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(0)")
        .attr("font-size","14")
        .style("text-anchor", "end");
        
        // Add y-axis
        svg.append("g")
        .call(d3.axisLeft(yScale));
        
        // Add x-axis label
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top ) 
        .style("text-anchor", "middle")
        .attr("font-size","16")
        .text("Ingredients");
        
        // Add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size","16")
        .text("Frequency");
       
        // Filter data based on selection
        let fData = data.filter(function(d) {
            return selectedIngredients.includes(d.Ingredient) &&
            selectedContinents.includes(d.Continent);
        })

        //Colour continents 
        var color = d3.scaleOrdinal()
        .domain(["North American",
                 "European",
                 "Oceanian",
                 "Asian",
                 "African",
                 "South American"])
        .range([ "#32a852",
                "#f7eb0a",
                "#f70a16",
                "#a00af7",
                "#ed0ebd",
                "#081078"])

        // add the circles
        const circle = svg.selectAll("circle")
        .data(fData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Ingredient) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(+d.Frequency))
        .attr('fill-opacity', 0.5)
        .attr("r", 5)
        .style("fill", function (d) { return color(d.Continent) } )
        .on("mouseover", function(event, d) {
            // show the tooltip
            const tooltip = d3.select("#tooltip");
            tooltip.style("display", "block");
            tooltip.style("left", event.pageX + 20 + "px");
            tooltip.style("top", event.pageY + 20 + "px");
            tooltip.select("#Frequency").text(`Frequency: ${d.Frequency}`);
            tooltip.select("#Ingredient").text(`Cuisine: ${d.Cuisine}`);
            tooltip.html(`<strong>Cuisine:</strong> ${d.Cuisine}`);
            
        })
        .on("mouseleave", function () {
            // hide the tooltip
            const tooltip = d3.select("#tooltip");
            tooltip.style("display", "none");
        });
        
    }
                                     
                                     
                                     ).catch(error => {
        console.error("Error loading the data:", error);
    });
}
fetchContinentsData();
updateChart();
