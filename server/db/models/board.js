var db = require('../config');
var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
  onEditShapes: {},
  paper: {
    customAttributes: {},
    ca: {},
    width: Number,
    height: Number,
    canvas: {},
    top: Number,
    bottom: Number,
    desc: {},
    defs: {},
    _top: Number,
    _left: Number
  },
  $el: {
    0: {},
    length: Number,
    prevObject: {
      0: {},
      context: {},
      length: Number
    },
    context: {},
    selector: String
  },
  canvasX: Number,
  canvasY: Number,
  tool: {
    name: String,
    fill: String
  }
});

var Board = mongoose.model('Board', boardSchema);

module.exports = Board;
