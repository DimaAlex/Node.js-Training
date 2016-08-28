var async = require('async');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  message: {
    type: String,
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


schema.statics.create = function(message, user, article, callback) {
  var Comment = this;
  async.waterfall([
    function (callback) {
      var comment = new Comment({message: message, article: article, user: user});
      comment.save(function (err) {
        if (err) throw err;
        callback(null, comment);
        article.comments.push(comment);

        article.save(function (err) {
          if (err) throw err;
        });
      });
    }
  ], callback);
};

exports.Comment = mongoose.model('Comment', schema);