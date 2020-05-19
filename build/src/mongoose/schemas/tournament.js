let mongoose = require('mongoose');

let tournament = new mongoose.Schema({
    season: String,
    UUID: String,
    rounds: Array,
    name: String
});

let Tournament = mongoose.model('storedTournaments', tournament);

module.exports = Tournament;