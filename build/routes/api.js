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

router.post(`/${api_version}/teams/team/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createTeam(req, res);

});

router.get(`/${api_version}/teams/team/:team`, (req, res) => {

    let team = req.params.team;

    mongoose.query_team(team).then(resp => {
    
        res.json({success: true, name: team, players: resp[0].players});
        
    }).catch(err => {
        res.json({success: false, message: err});
    });

});

module.exports = router;