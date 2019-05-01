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
app.get('/events', getEvents);



/****************
 * Callback Functions
 */
function getLocation(request, response) {
  try {
    const query = request.query.data;
    let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${ query }&key=${ process.env.GEOCODE_API_KEY }`;

    return superagent.get(geocodeURL)
      .end((err, apiResponse) => response.send(new Location(query, apiResponse.body.results[0])));

  } catch (error) {
    console.log(error);
    response.status(500).send('Status 500: I done messed up.');
  }
}

function getWeather(request, response) {
  try {
    console.log(request.query.data);
    let latitude = request.query.data.latitude;
    let longitude = request.query.data.longitude;
    let weatherURL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${longitude},${latitude}`;

    return superagent.get(weatherURL)
      .end((err, apiResponse) => {
        console.log(apiResponse.body.daily);
        // response.send(apiResponse.body.daily.data.map((day) => new Weather(day)))
      });

  } catch(error) { 
    console.log(error);
    response.status(500).send('Status 500: I done messed up.');
  }
}

function getEvents (request, response) {
  try {
    let latitude = request.query.data.latitude;
    let longitude = request.query.data.longitude;
    let eventURL = `https://www.eventbriteapi.com/v3/events/search?location.longitude=${ longitude }&location.latitude=${ latitude }&location.within=25km&expand=venue`;

    return superagent.get(eventURL)
      .set('Authorization', `Bearer ${ process.env.EVENTBRITE_API_KEY }`)
      .end((err, apiResponse) => {
        response.send(apiResponse.body.events.map((event) => new Event(event)));
      });

  } catch(error) {
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

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toDateString();
  this.summary = event.summary;
}


app.listen(port,() => console.log(`Listening on port ${port}`));
