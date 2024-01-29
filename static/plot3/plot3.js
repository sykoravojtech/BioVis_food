// set the dimensions and margins of the graph
const margin = {top: 100, right: 50, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

const margin2 = {top2: 10, right2: 10, bottom2: 30, left2: 120},
    width2 = 300 - margin2.left2 - margin2.right2,
    height2 = 1800 - margin2.top2 - margin2.bottom2;

// append the svg object to the body of the page
const svg = d3.select("#plotContainer")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

const svg2 = d3.select("#textContainer")
    .append("svg")
      .attr("width", width2 + margin2.left2 + margin2.right2)
      .attr("height", height2 + margin2.top2 + margin2.bottom2)
    .append("g")
      .attr("transform",`translate(${margin2.left2},${margin2.top2})`);

//Read the data
d3.csv(dataset).then(function(data) {

    // List of groups
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



    // Add a legend (interactive)
    svg2.selectAll("myLegend")
    .data(dataReady)
    .join('g')
    .append("foreignObject")
      .attr('x', -120)
      .attr('y', (d, i) => i * 20)
      .attr('width', 250)
      .attr("height", 200) // Set a fixed height for the scrollable container
      .attr("viewBox", "0,0,150,420")
      .style("overflow-y", "auto") // Enable vertical scrolling
      .html(d => `<input type="checkbox" id="${d.name}" /> <label for="${d.name}">${d.name}</label>`)
      .on("change", function (event, d) {
        // Get the checkbox state
        const isChecked = d3.select(this).select('input').property('checked');
  
        // Change the visibility of the corresponding lines based on the checkbox state
        d3.selectAll("." + d.name).transition().style("opacity", isChecked ? 1 : 0);
        d3.select(this).select('label').style("color", isChecked ? myColor(d.name) : "black");
      });

      
})