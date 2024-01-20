// ref: https://d3-graph-gallery.com/graph/line_select.html
// set the dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plotContainer")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(dataset).then( function(data) {

    const allGroup = ['northAmerican', 'mexican', 'american', 'canadian', 'hawaiian',
    'southwestern-united-states', 'asian', 'indian', 'german', 'european',
    'italian', 'southern-united-states', 'indonesian', 'pacific-northwest',
    'polish', 'chinese', 'british-columbian', 'danish', 'scandinavian',
    'swiss', 'swedish', 'french', 'african', 'australian', 'english',
    'quebec', 'middle-eastern', 'lebanese', 'greek', 'south-american',
    'russian', 'japanese', 'puerto-rican', 'spanish', 'irish', 'thai',
    'polynesian', 'iraqi', 'pakistani', 'scottish', 'south-african',
    'colombian', 'welsh', 'czech', 'filipino', 'cuban', 'belgian',
    'costa-rican', 'guatemalan', 'finnish', 'moroccan', 'iranian-persian',
    'turkish', 'portuguese', 'hungarian', 'georgian', 'brazilian',
    'nigerian', 'ethiopian', 'ecuadorean', 'peruvian', 'egyptian',
    'argentine', 'chilean', 'malaysian', 'nepalese', 'vietnamese',
    'palestinian', 'norwegian', 'austrian', 'libyan', 'angolan', 'korean',
    'cambodian', 'mongolian'];

    // adding options to the button
    d3.select("#dynamicDropdown")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) 
      .attr("value", function (d) { return d; })

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain([1999,2018])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [0,7500])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with group a
    const line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.year) })
          .y(function(d) { return y(+d.northAmerican) })
        )
        .attr("stroke", function(d){ return myColor("northAmerican") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection
      const dataFilter = data.map(function(d){return {time: d.year, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.time) })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#dynamicDropdown").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})