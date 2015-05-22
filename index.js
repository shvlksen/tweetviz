
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs'); //this is for filewriting

var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require("ntwitter");


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* not needed as we're using jade as the view engine
app.get('/', function(req, res){
  res.sendFile(__dirname + '/indesk.html');
});*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


var tw = new twitter({
        consumer_key: "AkL9W1OqkERjJk77FepcyLv8V",
        consumer_secret: "DxUiszCnjoAMbGAhbb9XcRKuK1HA6zps8zaqbSsblKfEkcokcG",
        access_token_key: "49379185-ASGO2MBzRF9f9TLijmXCyxa8wTbSZZjIAdF9pw1pM",
        access_token_secret: "AkIGdJMUvDuhBYnK6DffJA1nJF2gQDceJ1BzO8e8Hsdpu"
    }),
    stream = null;
    //track = "arsenal,chelsea, epl, gerrard, lampard",
    //users = [];


var coords; //json object which will have all the coordinates and to be filled later on


var latitude, longitude; //to calculate and store the lat-long of each tweet

var mongo = require('mongodb'); //for db

var Server = mongo.Server, 
			 Db = mongo.Db,
			 assert = require('assert'),
			 BSON = mongo.BSONpure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('twitterstream', server);
	

var retrieve = setInterval( function() { retrv() }, 10000);

function retrv() {


//timing calculations here:
var d = new Date();
/*console.log(" the time locally is: " + d.toLocaleTimeString());*/

var temp = 5*60*1000; //5 mins in ms

var tm = d.getTime() - temp; //convert into ms and subtract 5 minutes
		
console.log( " t: "+ d.getTime() + " and t-5 mins: " + tm);



db.open(function(err, db) {
assert.equal(null,err);

	var collection = db.collection('streamtwit'); //streamtwit is the name
	
	/*var num = collection.count();
	console.log("number = " + num);
*/

	var filepath = path.join(__dirname, "./helloworld.txt");
	

	collection.find( {  longitude : { $exists: true }, latitude : { $exists: true }, timestamp : { $lt: tm }   } ).sort({ _id: -1 }).limit(500).toArray(function(err,docs) {
		assert.equal(err,null);
	
		//assert.equal(31132,docs.length); //31132 is the number of tweets it has randomly captured till now
		console.log("Found the following records:");
		console.dir(docs);

		coords = JSON.stringify(docs);

		fs.writeFile(filepath, coords, function(err) {
			if(err) return console.log(err);
			console.log("written to file helloworld.txt");
			});

		//setTimeout(break, 4000); //breaks after 4 seconds of printing to give a 1 second gap
	});//*/


	});


}



//adding timing function - the function should be executed every 50 seconds. 1000 ms = 1 s
var tweeting = setInterval( function () { twiting() }, 50000);

//function starts here 	
function twiting() {

var d = new Date();
console.log(" the time locally is: " + d.toLocaleTimeString());


//database ops start:

db.open(function(err, db) {
	assert.equal(null,err);

	//comment it out if you dont want twitter stream and db retrieval running at the same time
	tw.stream(
		'statuses/filter',
		//{ track: ['word'] },
		{ locations: ['-180,-90,180,90'] },
		// bounding box over NYC and SF - {'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'},

		function(stream) {
			

			stream.on('data', function(data) {
				console.log(data);
				
				//parsing the location from the tweet objects here
				if (data.coordinates) {
		    		console.log("has coordinates");
                	if (data.coordinates !== null) {
                  		
                  		var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};
                  		console.log("printing this: " + outputPoint.lat + " and" + outputPoint.lng);
		    	  		
		    	  		longitude = outputPoint.lng;
		    	  		latitude = outputPoint.lat;
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
	                    var centerLat = 0.0;
	                    var centerLng = 0.0;

	                    
	                      coord = coordinates[0];
	                    
	                      console.log(coord + " is coord");
	                    
	                      //console.log( !isNaN(parseFloat(coord[0]) ) ); //checking if they are indeed numbers

	                      /* checking the conversions
	                      console.log("lat: "+ coord[1][0]  + " and long " + coord[0][1]);
	                      console.log("lat: "+ coord[2][0] +" and long " +   coord[1][1]);
	                      console.log("lat: "+ coord[3][0] +" + and long " + coord[2][1]);
	                      console.log("lat: "+ coord[0][0]  +" and long " +  coord[3][1]);
	                      */

	                      
	                      centerLat += coord[1][0] + coord[2][0] +coord[3][0] +coord[0][0];
	                      centerLng += coord[0][1] + coord[2][1] +coord[3][1] +coord[1][1];
	                      
	                    
	                      
	                      
	                      centerLat = centerLat/4;
	                      console.log(centerLat + " is lat");
	                      centerLng = centerLng/4;
	                      console.log(centerLng + " is long");
	                    
                		

                	// Build json object and broadcast it
                	var outputPoint = {"lat": centerLat,"lng": centerLng};
                	//console.log("place is : " + outputPoint.lat + "and" + outputPoint.lng);
                	longitude = outputPoint.lng, latitude = outputPoint.lat;
                	//iso.emit("chat message", outputPoint.lat + " and " + outputPoint.lng);

              		}
            	}

            	/* for checking if the timestamps are actually getting converted to numbers or not
            	if(Number(data.timestamp_ms) != NaN){
            	console.log("timestamp numbered = " + Number(data.timestamp_ms) + " and type: " + typeof Number(data.timestamp_ms));
            	}
            	else{
            		console.log("some error there");
            		}*/

            	//inserting the captured tweets in the proper format
				db.collection('streamtwit', function(err, collection) {
					collection.insert( [{ 'tweet': data.text, 
										'user': data.user.screen_name,
 										'timestamp': Number(data.timestamp_ms), 
					 					'longitude': longitude,
					 					'latitude': latitude, }],
					 					function(err, result) {
					 						assert.equal(err, null); //checking for no errors
					 						console.log("Number of tweets added: " + result.result.n);
					 						//
					 					}

					 				);
				}); //insertion code ends

			}); //stream.on ends here

			stream.on('destroy', function(response) {
				console.log("Stream ended now");
			});

		//let the stream run for 40 seconds and then destroy it
		setTimeout(stream.destroy, 40000);

		} //function stream ends here

		); //tw.stream ends here 


}); //db.open ends here //move this }); to after the next } if you wanna put the db open part outside the function tweeting scope

}//tw.stream block  and function tweeting ends here */

//db.close();	

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





module.exports = app;