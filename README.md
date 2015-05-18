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
