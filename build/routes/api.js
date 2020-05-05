/**
 * Router for the API endpoints. If this file exceeds the preferred size, we can break off into sub routers to ease
 * the development cycle.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('../src/mongoose/handler');

const router = express.Router();


const config = JSON.parse(fs.readFileSync(path.join(`${__dirname.split("routes")[0]}/package.json`), 'utf8'));
const api_version = config['custom-config']['api-version-string'];


router.get(`/${api_version}/`, (req, res) => {
    res.json({version: api_version.split('v')[1]});
});


router.post(`/${api_version}/players/player/create/`, (req, res) => {

    // We need to authenticate this later
    mongoose.createPlayer(req, res);


});


module.exports = router;