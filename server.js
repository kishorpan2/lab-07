'use strict';

/****************
 * Configure Middleware
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());



/****************
 * Create Routes
 */
app.get('/location', getLocation);
app.get('/weather', getWeather);



/****************
 * Callback Functions
 */
function getLocation(request, response) {
  try {
    const query = request.query.data;
    let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
    console.log();
    //const geoData = require('./data/geo.json');

    //response.send(new Location(query, geoData.results[0]));
    superagent.get(geocodeURL)
      .end((err, apiResponse)=>{
        console.log(apiResponse.body.results[0].geometry);
        const location = new Location(query,apiResponse.body.results[0]);
        response.send(location);
      });
  }
  catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
}

function getWeather(request, response) {
  try {
    //let weatherData = require('./data/darksky.json');
    // let weatherData = `https://maps.googleapis.com/maps/api/geocode/json?query=YOUR_API_KEY`;
    // let weatherObjects = weatherData.daily.data.map((day) => new Weather(day));
    // response.send(weatherObjects);
  }
  catch(error) { 
    console.log(error);
    response.status(500).send('Status 500: I done messed up.');
  }
}


/****************
 * Object Constructors
 */
function Location(query, data) {
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time).toDateString();
}



app.listen(port,() => console.log(`Listening on port ${port}`));
