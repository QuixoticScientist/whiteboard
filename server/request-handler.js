var mongoose = require('mongoose');
var db = require('./db/config');
var User = require('./db/models/user');
var jwt = require('jwt-simple');

exports.decodeToken = function(token) {
  var user = jwt.decode(token, 'nyan cat');
  return user._id
};

exports.loginUser = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email })
    .exec(function (err, user) {
      if (user === null) {
        res.redirect('/signup');
      } else {
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            console.error('Passwords did not match:', err);
            console.log('Redirecting back to login page...');
            res.redirect('/login');
          } else {
            // util.createSession(req, res, user);
            var token = jwt.encode(user, 'nyan cat');
            res.json({token: token});
            console.log(res);
          }
        })
      }
  });
};

exports.signupUser = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email })
    .exec(function (err, user) {
      if (user === null) {
        var newUser = new User({
          email: email,
          password: password
        });

        newUser.save(function (err, user) {
          if (err) {
            return console.error('Saving user to db failed');
          } else {
            var token = jwt.encode(user, 'nyan cat');
            res.json({token: token});
          }
        });        
      } else {
        console.log('Account already exists');
        res.redirect('/login');
      }
    });
};
