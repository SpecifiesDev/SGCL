let mongoose = require('mongoose');

let report = new mongoose.Schema({
    cid: String,
    message: String

});

let Report = mongoose.model('storedReports', report);

module.exports = Report;