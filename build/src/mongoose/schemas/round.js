let mongoose = require('mongoose');

let round = new mongoose.Schema({
    games: Array,
    type: String,
    UUID: String
});

let Round = mongoose.model('storedRounds', round);

module.exports = Round;