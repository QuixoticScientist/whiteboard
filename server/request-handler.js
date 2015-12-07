var jwt = require('jwt-simple');
// var Board = require('./db/models/board');
var client = require('./db/config');

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

exports.getBoard = function (req, res, next) {
  db.set('board', req.params.id);
  // Board.findOne({ endpoint: req.params.id })
  //    .exec(function (err, board) {
  //      if(err) {
  //       res.send(500, err);
  //      } else {
  //       if (!board) {
  //         // if no board found, create new board, save to database, and send to middleware
  //         var newBoard = new Board({
  //           endpoint: req.params.id
  //         });

  //         newBoard.save(function (err, board) {
  //           if (err) {
  //             throw new Error(err);
  //           } else {
  //             req.board = board;
  //             next();
  //           }
  //         });

  //       } else {
  //         // if board found, send to middleware
  //         req.board = JSON.stringify(board);
  //         next();
  //       }
  //      }
  //    });
  // console.log('board', req.params.id);
};
