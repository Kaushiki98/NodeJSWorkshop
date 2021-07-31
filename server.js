const express = require('express')

// create express app
const app = express();

// Configuring the database
const dbConfig= require('./dbconfig');
const mongoose = require('mongoose');

app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser:true
}).then(() => {
  console.log("Successfully connected to database");
}).catch(err => {
  console.log('could not connect to database', err);
  process.exit();
})

app.use(require('./app/router'))

// define a simple route
app.get('/',(req, res) => {
  res.json({'message':'Welcome'})
})

// listen for requests
app.listen(3000, () => {
  console.log("server started")
})

module.exports = app;