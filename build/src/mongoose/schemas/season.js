let mongoose = require('mongoose');

let season = new mongoose.Schema({
    number: String,
    tournaments: Array
});

let Season = mongoose.model('seasons', season);

module.exports = Season;