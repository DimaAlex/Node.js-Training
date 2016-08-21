var express = require('express');
var router = express.Router();
var Article = require('../models/article').Article;
var User = require('../models/user').User;

router.get('/', function(req, res, next) {
  Article.find({}, function (err, articles) {
    if (err) return next(err);

    res.render('articles/index', { articles: articles });
  });
});

router.get('/new', function (req, res, next) {
  res.render('articles/new');
});

router.post('/new', function (req, res, next) {
  var title = req.body.title;
  var body = req.body.body;

  var article = new Article({ title: title, body: body, userId: req.session.currentUserId });
  article.save(function (err) {
    if (err) return next(err);
  });

  res.send({});
});

router.get('/:id', function (req, res, next) {
  Article.findById(req.params.id, function (err, article) {
    if (err) return next(err);

    User.findById(article.userId, function (err, user) {
      if (err) return next(err);

      res.render('articles/show', { article: article, author: user.username });
    });
  });
});

router.get('/:id/edit', function (req, res, next) {
  Article.findById(req.params.id, function (err, article) {
    if (err) return next(err);

    res.render('articles/edit', { article: article });
  });

router.post('/:id/edit', function (req, res, next) {
  var title = req.body.title;
  var body = req.body.body;

  Article.findById(req.params.id, function (err, article) {
    if (err) return next(err);

    if (article) {
      article.title = title;
      article.body = body;

      article.save(function (err) {
        if (err) return next(err);
      });
    }
  });

  res.send({});
});
});

module.exports = router;