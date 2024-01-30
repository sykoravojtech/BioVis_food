// set the dimensions and margins of the graph
const margin = {top: 100, right: 50, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plotContainer")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(dataset).then(function(data) {
    
    // List of groups
    const allGroup = data.columns.slice(1);
    console.log(allGroup)
    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", 
      "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", 
      "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", 
      "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", 
      "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", 
      "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9",
      "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd",
      "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5",
      "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15",
      "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe",
      "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe", "#c85b74",
      "#68ff57", "#b62347", "#994b91", "#646b8c", "#977ab4", "#d694fd",
      "#c4d5b5", "#fdc4bd", "#1cae05", "#7bd972", "#e9700a", "#d08f5d", 
      "#8bb9e1", "#fde945"]);   
      
      
    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map( function(grpName) { 
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: parseInt(d.year), value: +parseFloat(d[grpName])};
        })
      };
    });
    
    console.log(dataReady)

    //removing commas from the x axis year values
    function customFormat(value) {
        // Convert the value to a string and remove commas
        return String(value).replace(/,/g, '');
    }

    // Add X axis
    const x = d3.scaleLinear()
      .domain([1999,2018])
      .range([ 0, width ]);

    var xAxis = d3.axisBottom(x).tickFormat(customFormat);
    
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [0,100])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the lines
    const line = d3.line()
      .x(d => x(+d.time))
      .y(d => y(+d.value))
    svg.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 4)
        .style("fill", "none")
        .style("opacity", 0);

        svg
        .selectAll("myDots")
        .data(dataReady)
        .join('g')
          .style("fill", d => myColor(d.name))
        .selectAll("dot")
          .data(d => d.values)
          .join("circle")
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.value))
            .attr("r", 5)
            .attr("class", d => "circle" + d.name)
            .style("opacity", 0)

      
        // Get the form and all checkboxes
        var form = document.getElementById("formContainer");
        var checkboxes = form.querySelectorAll('input[type="checkbox"]');
    

    
        // Add event listener to each checkbox
        checkboxes.forEach(function (checkbox) {
            var checkedLabel = checkbox.value.replace(' ',"-");
            checkbox.addEventListener("change", function () {
              
                console.log(checkedLabel)
                var label = checkbox.parentElement;
                label.style.color = checkbox.checked ? myColor(checkedLabel) : '#333';
                d3.selectAll("." + checkedLabel).transition().style("opacity", checkbox.checked ? 1 : 0);
            });

            //initial state
            d3.selectAll("." + checkedLabel).transition().style("opacity", checkbox.checked ? 1 : 0);
            var label = checkbox.parentElement;
            label.style.color = checkbox.checked ? myColor(checkedLabel) : '#333';

        });
    
     
})