var jwt = require('jwt-simple');

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
