var jwt = require('jwt-simple');
var Board = require('./db/models/board');

exports.decodeToken = function(token) {
  var user = jwt.decode(token, 'nyan cat');
  return user.addr;
};

exports.getToken = function (req, res) {
  var addr = req.connection.remoteAddress;
  console.log(addr);
  var user = {addr: addr};
  var token = jwt.encode(user, 'nyan cat');
  res.json({token: token});
};

exports.getBoard = function (req, res) {
  // Board.find({endpoint: req.data.endpoint})
  //    .exec(function (err, board) {
  //      if(err) {
  //       res.send(500, err);
  //      } else {
  //       res.json(board);
  //      }
  //    });
  console.log('board');
};
