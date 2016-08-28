var async = require('async');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  number: {
    type: Number,
    require: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.statics.create = function(number, user, article, callback) {
  var Mark = this;
  async.waterfall([
    function (callback) {
      Mark.findOne({ user: user, article: article }, callback);
    },
    function (mark, callback) {
      if (mark) {
        mark.number = number;

      } else {
        mark = new Mark({ number: number, article: article, user: user });
        article.marks.push(mark);
        article.save();
      }
      mark.save(function (err) {
        if (err) throw err;

        callback(null, mark);
      });
    }
  ], callback);
};


schema.statics.destroy = function(user, article, callback) {
  var Mark = this;
  async.waterfall([
    function (callback) {
      Mark.findOne({ user: user, article: article }, callback);
    },
    function (mark, callback) {
      mark.remove( function(err, mark) {
        if (err) throw err;

        article.marks.pull(mark);
        article.save();

        callback(null, mark);
      });
    }
  ], callback);
};

exports.Mark = mongoose.model('Mark', schema);