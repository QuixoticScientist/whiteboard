var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  }.bind(user));
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
