'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const handleNotFound = require('./handlers/404.js');
const handleError = require('./handlers/500.js');
const logger = require('./middleware/logger.js');
const timeStamp = require('./middleware/timestamp.js');
const { validateName } = require('./middleware/validator.js');

const app = express();

let database = {

};

app.use(cors());

app.use(timeStamp);
app.use(logger);


app.get('/', getHomePage);
app.get('/data', getData);
app.get('/data/:id', getData);
app.get('/broken', simulateError);
app.get('/person', validateName, getPerson);

app.use( handleError );
app.use('*', handleNotFound);

function getData(req, res) {
  res.status(200).json(database);
}

function getPerson( req, res, next ) {
  let name = req.query.name;
  let personDatabase = {
    name: name,
  };
  res.status(200).json(personDatabase);

}

function getHomePage(req, res) {
  res.status(200).send('Hello World');
}

function simulateError(req, res, next) {
  next('We have a problem');
}

function start(port) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = {app, start};
