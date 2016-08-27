var async = require('async');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    require: true
  },
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

schema.index({ title: 'text' });

schema.statics.create = function(title, body, user, callback) {
  var Article = this;
  async.waterfall([
    function (callback) {
      var article = new Article({ title: title, body: body, user: user });
      article.save(function (err) {
        if (err) throw err;

        user.articles.push(article);
        user.save(function (err) {
          if (err) throw err;
        });

        callback(null, article);
      });
    }
  ], callback);
};

schema.statics.update = function(articleId, title, body, callback) {
  var Article = this;
  async.waterfall([
    function (callback) {
      Article.findById(articleId, callback);
    },
    function (article, callback) {
      article.title = title;
      article.body = body;

      article.save(function(err) {
        if (err) throw err;

        callback(null, article);
      });
    }
  ], callback);
};

schema.statics.destroy = function(articleId, callback) {
  var Article = this;
  async.waterfall([
    function (callback) {
      Article.findById(articleId, callback);
    },
    function (article, callback) {
      article.remove(function(err, article) {
        if (err) throw err;
        callback(null, article);
      });
    }
  ], callback);
};

exports.Article = mongoose.model('Article', schema);