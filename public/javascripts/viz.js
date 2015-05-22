/*
commented out because this is only for the usa map case

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

///* append JSON features to the svg as states
states.selectAll("path")
  .data(mapFeatures.features)
.enter().append("path")
  .attr("d", path); */

// Note: if you are reading the JSON from a file, the code will look like this:

/*d3.json("/javascripts/usamap.json", function (collection) {
   states.selectAll("path")
     .data(collection.features)
     .enter().append("path")
     .attr("d", path); 
});


//.attr("cy", function(d) { console.log(d.coordinates[1] + " -cy"); return projection(d.coordinates)[1];})
  //.attr("cx", function(d) { console.log(d.coordinates[0] + "-cx"); return projection(d.coordinates)[0];})
//

/*
// map the coordinates
var locations = d3.select(".locations").selectAll('circle')
  .data(coordinates);

locations.enter().append("svg:circle")
    .attr("cy", function(d) { return projection(d.coordinates)[1];})
  .attr("cx", function(d) { return projection(d.coordinates)[0];})
    .attr("id", function(d) { return d.label})
    .attr("r", 4.5);
  */                                                        


//using mercator projection for the world map here:

var width = 960,
	height = 960;

var projection = d3.geo.mercator()
	.scale((width + 1) / 2 / Math.PI)
  .translate([width / 2, height / 2])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

svg.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);

//adding a g layer on the svg which will host the locations    
var locations = svg.append("svg:g")
  .attr("class", "locations");

d3.json("/javascripts/worldmap.json", function(error, world) {
	svg.insert("path", ".graticule")
	.datum(topojson.feature(world, world.objects.land))
	.attr("class", "land")
	.attr("d", path);

	svg.insert("path", ".graticule")
	.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
	.attr("class", "boundary")
	.attr("d", path);
});


//getting the coordinates from the server, where the server writes to the json file

d3.json("/javascripts/coordinates.json", function (error, items) {
   
   if(error) return console.log(error + " - is the error");

   var coords = items;

	var locations = d3.select(".locations").selectAll('circle')
  .data(coords);


	locations.enter().append("svg:circle")
  	.attr("cy", function(d) { 
  		var datum = [d.longitude,d.latitude];
  		
  		//console.log(projection(datum)[1] + " and " + projection(datum)[0]  );
  		
  		return projection(datum)[1];
  	})

	.attr("cx", function(d) { 
		var datum = [d.longitude,d.latitude];
		return projection(datum)[0];
	})  

    .attr("id", function(d) { return d.user})
    .attr("r", 4.5);



   });

d3.select(self.frameElement).style("height", height + "px");