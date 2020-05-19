let mongoose = require('mongoose');

let game = new mongoose.Schema({
    teams: Array,
    placements: {
        type: Map,
        of: Object
    },
    UUID: String
});

let Game = mongoose.model('storedGames', game);

module.exports = Game;