
var width = 960,
    height = 700;

//using spherical mercator projection
var projection = d3.geo.mercator()
  .scale( (width + 1) / 2 / Math.PI)
  .translate([ width / 2, height / 2 ])
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


//adding a 'g' layer on the svg which will group all the locations together

var locations = svg.append("svg:g") //'svg' tells the 'g' is of svg namespacing.
  .attr("class", "locations");

(function mapping(){

//getting the coordinates from the server, where the server writes to the json file

d3.json("/javascripts/coordinates.json", function (error, items) {
   
   if(error) return console.log(error + " - is the error");

   var coords = items;

	var locs = d3.select(".locations").selectAll('circle').data(coords);

  //twitter data set is reversed, so long and lat need to be reversed

	locs.enter().append("svg:circle")
  	.attr("cy", function(d) { 

  		var datum = [d.latitude,d.longitude];
  		
      
  		//console.log(projection(datum)[1] + " and " + projection(datum)[0]  );
  		
  		return (projection(datum)[1]);
      
  	})

	.attr("cx", function(d) { 
		var datum = [d.latitude,d.longitude];
    
    
		return (projection(datum)[0]);
    
	})  

    .attr("id", function(d) { return d.user})
    .attr("r", 3.5);



   });


setTimeout(mapping, 30000); //restart it every 30 seconds
})();



d3.select(self.frameElement).style("height", height + "px");