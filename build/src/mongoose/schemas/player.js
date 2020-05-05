let mongoose = require('mongoose');

let player = new mongoose.Schema({
    ign: String,
    team: String
});

let Player = mongoose.model('storedPlayers', player);

module.exports = Player;