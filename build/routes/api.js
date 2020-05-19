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

router.post(`/${api_version}/games/game/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createGame(req, res);
});

router.post(`/${api_version}/tournaments/tournament/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createTournament(req, res);
});

router.post(`/${api_version}/seasons/season/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createSeason(req, res);
});

router.post(`/${api_version}/rounds/round/create/`, (req, res) => {

    // Also need to authenticate later
    mongoose.createRound(req, res);
});

router.get(`/${api_version}/teams/team/:team`, (req, res) => {

    let team = req.params.team;

    mongoose.query_team(team).then(resp => {
    
        res.json({success: true, name: team, players: resp[0].players});
        
    }).catch(err => {
        res.json({success: false, message: err});
    });

});

router.get(`/${api_version}/players/player/:player`, (req, res) => {
    let name = req.params.player;

    mongoose.query_player(name).then(resp => {
        let parsed = resp[0];

        res.json({success: true, ign: parsed.ign, team: parsed.team, games: parsed.games});
    }).catch(err => {
        res.json({success: false, message: err});
    })
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

        res.json({success: true, id: parsed.UUID, rounds: parsed.rounds, name: parsed.name});

    }).catch(err => {
        res.json({success: false, message: err});
    })
});

router.get(`/${api_version}/rounds/round/:round`, (req, res) => {
    let round = req.params.round;

    mongoose.query_round(round).then(resp => {
        let parsed = resp[0];

        resp.json({success: true, id: parsed.UUID, games: parsed.games});
    }).catch(err => {
        res.json({success: false, message: err});
    })
});

module.exports = router;