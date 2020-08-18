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

router.post(`/${api_version}/tournaments/tournament/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createTournament(req, res);
});

router.post(`/${api_version}/seasons/season/create/`, (req, res) => {
    // Also need to authenticate later
    mongoose.createSeason(req, res);
});

router.get(`/${api_version}/players/player/:player`, (req, res) => {
    let name = req.params.player;

    mongoose.query_player(name).then(resp => {
        let parsed = resp[0];

        res.json({success: true, id: parsed.uuid,ign: parsed.ign, kills: parsed.kills, deaths: parsed.deaths, points: parsed.points, seasons: parsed.seasons, tournaments: parsed.tourns});
    }).catch(err => {
        res.json({success: false, message: err});
    })
});

router.get(`/${api_version}/players/player/:player/xp`, (req, res) => {

    let name = req.params.player;

    mongoose.query_player(name).then(resp => {

        let parsed = resp[0];

        let kills = parsed.kills;
        let points = parsed.points;


        /**
         * For now modifiers are:
         * Kills - 3xp
         * Points - .5xp
         */

         // calculate base xp of the player
         let base = (kills * 3) + (points * .5);

         // for now the required xp to begin modifying will be set to 50
         if(base > 25) {

            let weight = Math.log2(base) / 100;

            let killModifier = 3 * (1 + weight);
            let pointModifier = .5 * (1 + weight);

            res.json({success: true, xp: Math.ceil((kills * killModifier) + (points * pointModifier))});
            

         } else res.json({success: true, xp: Math.ceil(base)});



    }).catch(err => {

    });

});

router.get(`/${api_version}/seasons/season/:season`, (req, res) => {
    let season = req.params.season;

    mongoose.query_season(season).then(resp => {
        let parsed = resp[0];

        res.json({success: true, number: parsed.number, tournaments: parsed.tournaments});
    }).catch(err => {
        res.json({success: false, message: err});
    })
});

router.get(`/${api_version}/tournaments/tournament/:tourn`, (req, res) => {
    let tournament = req.params.tourn;

    mongoose.query_tournaments(tournament).then(resp => {

        let parsed = resp[0];

        let rounds = [];

        for(let [k, v] of parsed.rounds) {
            rounds.push(v);
        }

        res.json({success: true, name: parsed.name, id: parsed.UUID, type: parsed.type, rounds: rounds});

    }).catch(err => {
        res.json({success: false, message: err});
    })
});


module.exports = router;