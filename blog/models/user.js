var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  city: {
    type: String
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  articles: [{
    type: Schema.ObjectId,
    ref: 'Article'
  }]
});

schema.index({ username: 'text' });

schema.methods.encryptedPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
      this._plainPassword = password;
      this.salt = Math.random() + '';
      this.hashedPassword = this.encryptedPassword(password);
    })
    .get(function () { return this._plainPassword; });

schema.methods.checkPassword = function (password) {
  return this.encryptedPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function (callback) {
      User.findOne({username: username}, callback);
    },
    function (user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError("Incorrect password"));
        }
      } else {
        var user = new User({username: username, password: password});
        user.save(function (err) {
          if (err) return next(err);

          callback(null, user);
        });
      }
    }
  ], callback);
};

schema.statics.update = function(currentUser, username, firstName, lastName, city, paramsId, callback) {
  var User = this;
  async.waterfall([
    function (callback) {
      User.findById(currentUser.id, callback);
    },
    function (user, callback) {
      if (currentUser.id == paramsId) {
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.city = city;

        user.save(function(err) {
          if (err) throw err;

          callback(null, user);
        });
      } else {
        next(new AuthError("No permission"));
      }
    }
  ], callback);
};

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.User = mongoose.model('User', schema);
exports.AuthError = AuthError;