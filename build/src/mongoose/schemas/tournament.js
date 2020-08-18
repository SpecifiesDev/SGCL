let mongoose = require('mongoose');

let tournament = new mongoose.Schema({
    season: String,
    UUID: String,
    rounds: {
        type: Map,
        of: Object
    },
    name: String,
    type: String
});

let Tournament = mongoose.model('storedTournaments', tournament);

module.exports = Tournament;