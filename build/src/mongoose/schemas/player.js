let mongoose = require('mongoose');

let player = new mongoose.Schema({
    ign: String,
    uuid: String,
    kills: Number,
    deaths: Number,
    points: Number,
    tourns: Array,
    seasons: Array
});

let Player = mongoose.model('storedPlayers', player);

module.exports = Player;