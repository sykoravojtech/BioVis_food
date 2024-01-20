// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Your list of options
    var optionsList = ['north-american', 'mexican', 'american', 'canadian', 'hawaiian',
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
  
    var dropdown = d3.select("#dynamicDropdown");
  
    // Use D3's data binding to create/update options
    var options = dropdown.selectAll("option")
      .data(optionsList);
  
    // Update existing options
    options.text(function (d) { return d; });
  
    // Enter new options
    options.enter()
      .append("option")
      .attr("value", function (d, i) { return "option" + (i + 1); })
      .text(function (d) { return d; });
  
  });
  