let mongoose = require('mongoose');

let team = new mongoose.Schema({
    name: String,
    players: Array
});

let Team = mongoose.model('storedTeams', team);

module.exports = Team;