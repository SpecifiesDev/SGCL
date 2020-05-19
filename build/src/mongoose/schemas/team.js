const mongoose = require('mongoose');

let team = new mongoose.Schema({
    name: String,
    players: Array,
    wins: Number,
    losses: Number
});

let Team = mongoose.model('storedTeams', team);

module.exports = Team;