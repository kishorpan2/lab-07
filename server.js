'use strict';

/****************
 * Configure Middleware
 */
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());



/****************
 * Routes
 */
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents);

app.listen(port,() => console.log(`Listening on port ${port}`));



/****************
 * Handlers
 */
function getLocation(request, response) {
    const query = request.query.data;
    let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${ query }&key=${ process.env.GEOCODE_API_KEY }`;

    return superagent.get(geocodeURL)
      .then((apiResponse) => response.send(new Location(query, apiResponse.body.results[0])))
      .catch((error) => handleError(error, request, response));
}

function getWeather(request, response) {
<<<<<<< HEAD
  try {
    //let weatherData = require('./data/darksky.json');
    // let weatherData = `https://maps.googleapis.com/maps/api/geocode/json?query=YOUR_API_KEY`;
    // let weatherObjects = weatherData.daily.data.map((day) => new Weather(day));
    // response.send(weatherObjects);
  }
  catch(error) { 
    console.log(error);
    response.status(500).send('Status 500: I done messed up.');
=======
    let latitude = request.query.data.latitude;
    let longitude = request.query.data.longitude;
    let weatherURL = `https://api.darksky.net/forecast/${ process.env.WEATHER_API_KEY }/${ latitude },${ longitude }`;

    return superagent.get(weatherURL)
      .then((apiResponse) => response.send(apiResponse.body.daily.data.map((day) => new Weather(day))))
      .catch((error) => handleError(error, request, response));
}

function getEvents (request, response) {
    let latitude = request.query.data.latitude;
    let longitude = request.query.data.longitude;
    let eventURL = `https://www.eventbriteapi.com/v3/events/search?location.longitude=${ longitude }&location.latitude=${ latitude }&location.within=25km&expand=venue`;

    return superagent.get(eventURL)
      .set('Authorization', `Bearer ${ process.env.EVENTBRITE_API_KEY }`)
      .then((apiResponse) => response.send(apiResponse.body.events.map((event) => new Event(event))))
      .catch((error) => handleError(error, request, response));
}

function handleError(err, req, res) {
  console.error('ERROR:', err);

  if (res) {
    res.status(500).send('Status 500: I done messed up.');
>>>>>>> ff959328fe5c7588a4845b4506d5a644822f0dcf
  }
}


/****************
 * Constructors
 */
function Location(query, data) {
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toDateString();
  this.summary = event.summary;
}



