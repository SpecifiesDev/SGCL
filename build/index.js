// libraries
const express = require("express");
const fs = require('fs');
const path = require('path');

// routers
const api = require('./routes/api');
const website = require('./routes/website');

// declare app constant
const app = express();

// parse package.json for custom parameters we want to use to ease the dev cycle
const config = JSON.parse(fs.readFileSync(path.join(`${__dirname}/package.json`), 'utf8'));

// pull configs
const port = config['custom-config'].port;

// static host our public folder
app.use(express.static(path.join(`${__dirname}/public`)));

// set up our routes
app.use('/api', api);
app.use('/', website);

app.listen(port, () => {console.log("Server started");});