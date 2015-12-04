var db = require('../config');
var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
  name: String,
  endpoint: String
});

var Board = mongoose.model('Board', boardSchema);

module.exports = Board;
