var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require("ntwitter");


var tw = new twitter({
        consumer_key: "AkL9W1OqkERjJk77FepcyLv8V",
        consumer_secret: "DxUiszCnjoAMbGAhbb9XcRKuK1HA6zps8zaqbSsblKfEkcokcG",
        access_token_key: "49379185-ASGO2MBzRF9f9TLijmXCyxa8wTbSZZjIAdF9pw1pM",
        access_token_secret: "AkIGdJMUvDuhBYnK6DffJA1nJF2gQDceJ1BzO8e8Hsdpu"
    }),
    stream = null;
    //track = "arsenal,chelsea, epl, gerrard, lampard",
    //users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var latitude, longitude;

var mongo = require('mongodb'); //for db

var Server = mongo.Server, 
			 Db = mongo.Db,
			 assert = require('assert'),
			 BSON = mongo.BSONpure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('twitterstream', server);

db.open(function(err, db) {
	assert.equal(null,err);

	//commented it out because i dont want twitter stream and db retrieval running at the same time
	tw.stream(
		'statuses/filter',
		//{ track: ['word'] },
		{ locations: ['-180,-90,180,90']},
		function(stream) {
			stream.on('data', function(data) {
				console.log(data);

				//parsing the location from the tweet objects here
				if (data.coordinates) {
		    		console.log("has coordinates");
                	if (data.coordinates !== null) {
                  		//If so then build up some nice json and send out to web sockets
                  		var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
                  		console.log("printing this: " + outputPoint.lat + " and" + outputPoint.lng);
		    	  		//io.emit('chat message', outputPoint.lat + " and" + outputPoint.lng);
		    	  		longitude = outputPoint.lng, latitude = outputPoint.lat;
                	}
                }
                if(data.place){
                	console.log("has place");
                	if(data.place.bounding_box.type === 'Polygon'){
                		console.log("has polygon");
                		var coordinates = data.place.bounding_box.coordinates;
                		console.log(data.place.bounding_box.coordinates);
                	// Calculate the center of the bounding box for the tweet
	                    var coord, _i, _len;
	                    var centerLat = 0;
	                    var centerLng = 0;

	                    for (_i = 0, _len = coordinates.length; _i < _len; _i++) {
	                      coord = coordinates[_i];
	                      centerLat += coord[0];
	                      centerLng += coord[1];
	                    }
                		centerLat = centerLat / coordinates.length;
                		centerLng = centerLng / coordinates.length;

                	// Build json object and broadcast it
                	var outputPoint = {"lat": centerLat,"lng": centerLng};
                	console.log("place is : " + outputPoint.lat + "and" + outputPoint.lng);
                	longitude = outputPoint.lng, latitude = outputPoint.lat;
                	//io.emit("chat message", outputPoint.lat + " and " + outputPoint.lng);

              		}
            	}


				db.collection('streamadams', function(err, collection) {
					collection.insert( [{ 'tweet': data.text, 
										'user': data.user.screen_name,
 										'timestamp': data.timestamp_ms, 
					 					'longitude': longitude,
					 					'latitude': latitude, }],
					 					function(err, result) {
					 						assert.equal(err, null); //checking for no errors
					 						console.log("Number of tweets added: " + result.result.n);
					 						//
					 					}


					 					);
				});
			});
		}
		);
		//tw.stream block ends here

	
/*
	var collection = db.collection('streamadams'); //streamadams is what I had named it originally
	
	var num = collection.count();
	console.log("number = " + num);
	
	collection.find({}).toArray(function(err,docs) {
		assert.equal(err,null);
		assert.equal(1809,docs.length); //1809 is the number of tweets it has randomly captured till now
		console.log("Found the following records:");
		console.dir(docs);
	});//db retrieval code till here*/


});




/*
io.on('connection', function(socket){
	console.log("user connected");
  //dont need this for auto starting socket.on('chat message', function(msg){

	console.log("chat messaging started");
	  	
		tw.stream('statuses/filter',
				   { locations : '-122.75,36.8,-121.75,37.8,-74,40,-73,41' }, 
				   //{ locations : ['-180','-90','180','90'] },
				   //{ track: ['arsenal','chelsea', 'epl', 'gerrard', 'lampard'] }, 
				   //{track : ['morning', 'night', 'life', 'happy']},
		function(stream) {
		  	stream.on('data', function (data) {
		    	console.log(data);
		    	//console.log(data.user);
		    	//console.log(data.coordinates);
		    	//io.emit('chat message', data.text);
		    	

		    	if (data.coordinates) {
		    		console.log("has coordinates");
                	if (data.coordinates !== null) {
                  		//If so then build up some nice json and send out to web sockets
                  		var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
                  		console.log("printing this: " + outputPoint.lat + " and" + outputPoint.lng);
		    	  		io.emit('chat message', outputPoint.lat + " and" + outputPoint.lng);
                	}
                }
                if(data.place){
                	console.log("has place");
                	if(data.place.bounding_box.type === 'Polygon'){
                		console.log("has polygon");
                		var coordinates = data.place.bounding_box.coordinates;
                	// Calculate the center of the bounding box for the tweet
	                    var coord, _i, _len;
	                    var centerLat = 0;
	                    var centerLng = 0;

	                    for (_i = 0, _len = coordinates.length; _i < _len; _i++) {
	                      coord = coordinates[_i];
	                      centerLat += coord[0];
	                      centerLng += coord[1];
	                    }
                		centerLat = centerLat / coordinates.length;
                		centerLng = centerLng / coordinates.length;

                	// Build json object and broadcast it
                	var outputPoint = {"lat": centerLat,"lng": centerLng};
                	console.log("place is : " + outputPoint.lat + "and" + outputPoint.lng);
                	io.emit("chat message", outputPoint.lat + " and " + outputPoint.lng);

              		}
            	}*/

/* only if need user location explicitly
            	if(data.user.location) {
            		console.log("has location");
            		var outputPoint = data.user.location;
                	console.log("location is : " + outputPoint);
                	io.emit("chat message", outputPoint);
	
            	}*/
            	

/*
		  	});
		});

	//io.emit('chat message', msg);
//  	});
});
*/
http.listen(3000, function(){
  console.log('listening on *:3000');
});
