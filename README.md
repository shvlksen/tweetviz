# Tweet-Viz

This is the source code for a NodeJs app that will visualize real time tweets on a map using D3.

The app will be hosted on heroku in all probability and the source code maintained here.

To run the app:

1) Git clone https://github.com/shvlksen/tweetviz.git - into a new directory

2) npm install

3) make a /data folder inside your app directory - this will store the mongodb database 

4) open cmd and navigate to the /data folder you just created. Inside it, initialize a new mongodb database - follow the steps given here https://www.npmjs.com/package/mongodb

5) Make a new Twitter App using your own Twitter account - cope the 4 ids and keys needed in server.js (marked as IMPORTANT-NEEDED) 

5) You will also need to edit the DB details inside index.js according to the DB that you have made. My settings are currently in place, which in all probability will not work for yours.

How it works:

The app is NodeJS based. It uses the Twitter Streaming API to capture tweets marked with locations.
The tweets are saved in a MongoDB database with the longitude and latitude explicitly.

![alt tag](https://github.com/shvlksen/tweetviz/blob/master/public/images/Screenshot%20from%202015-05-30%2016:32:53.png)

Then, at a regular interval, a snapshot of the database entries is written to a JSON file filtering for tweets no more than 5 minutes old. 

On the front end, a map of the world is rendered using D3. 

D3 also opens the JSON file containing the tweets and loads all the coordinates onto a separate 'locations' layer.
Each point is then marked with a translucent circle on the map.

The locations are autorefreshed every 1 minute to get the latest tweet locations.

![alt tag](https://github.com/shvlksen/tweetviz/blob/master/public/images/Screenshot%20from%202015-05-30%2016:33:29.png)


#Things to do:

Add a text box/slider for the user to be able to change the refresh rate of the tweets. (Currently set to 5 mins)

#Next part:

Sentiment analysis and visualization using the Twitter Sentiment class and D3. 
