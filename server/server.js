const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const config = require('./config.js');
const mongoose = require('mongoose');

require('./app/routes.js')(app);

mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Connection error: ', err);
  process.exit();
});

app.get('/', (req, res) => {
  res.json({'message': "Welcome to challenge"});
});

app.listen(config.serverport, () => {
  console.log("server is running at port " + config.serverport);
});