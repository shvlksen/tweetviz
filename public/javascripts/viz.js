var width = 960,
    height = 500;

//  Create a projection of the US
var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width/2, height/2]);

var path = d3.geo.path().projection(projection);

// Create the SVG that state paths and location points will be attached to
var d3_map = d3.select("body").append("svg:svg")
  .attr("width", width)
  .attr("height", height);

// Create a 'g' element within the SVG which state paths will be attached to
var states = d3_map.append("svg:g")
  .attr("class", "states");
        
var locations = d3_map.append("svg:g")
  .attr("class", "locations");

// Read the paths of the states from a JSON file
// Attach the paths of the states to #states within the SVG

// Note: normally this data would be read from a .json file

//var mapFeatures = usamap;

/*// append JSON features to the svg as states
states.selectAll("path")
  .data(mapFeatures.features)
.enter().append("path")
  .attr("d", path); */

// Note: if you are reading the JSON from a file, the code will look like this:

d3.json("/javascripts/usamap.json", function (collection) {
   states.selectAll("path")
     .data(collection.features)
     .enter().append("path")
     .attr("d", path); 
});

//getting the coordinates from the server
//var coordinates = coord;

//var coordinates;

d3.json("/javascripts/coordinates.json", function (error, items) {
   
   if(error) return console.log(error + " - is the error");

   var coordinates = items;

	var locations = d3.select(".locations").selectAll('circle')
  .data(coordinates);

	locations.enter().append("svg:circle")
    .attr("cy", function(d) { return projection(d.coordinates)[1];})
	.attr("cx", function(d) { return projection(d.coordinates)[0];})
    .attr("id", function(d) { return d.label})
    .attr("r", 4.5);



   });




/*// map the coordinates
var locations = d3.select(".locations").selectAll('circle')
  .data(coordinates);

locations.enter().append("svg:circle")
    .attr("cy", function(d) { return projection(d.coordinates)[1];})
	.attr("cx", function(d) { return projection(d.coordinates)[0];})
    .attr("id", function(d) { return d.label})
    .attr("r", 4.5);
  */                                                        

var temp = tmp.value;
console.log("the number is:" + temp);
