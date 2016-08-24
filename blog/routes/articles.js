var express = require('express');
var router = express.Router();
var Article = require('../models/article').Article;
var User = require('../models/user').User;
var Mark = require('../models/mark').Mark;

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
  var averageMark = 0;
  var numbers = [];

  Article.findById(req.params.id, function (err, article) {
    if (err) return next(err);

    User.findById(article.userId, function (err, user) {
      if (err) return next(err);

      Mark.find({ articleId: article.id }, function (err, marks) {
        if (err) next(err);

        marks.forEach(function (mark) {
          numbers.push(mark.number);
        });
        if (numbers.length > 0) {
          var sum = numbers.reduce(function (a, b) {
            return a + b;
          });
          averageMark = sum / numbers.length;
        }

      });

      Mark.findOne({ articleId: article.id, userId: user.id }, function (err, mark) {
        if (err) next(err);

        var markValue = mark ? mark.number : 0;
        res.render('articles/show', { article: article, author: user.username, markValue: markValue,
            averageMark: averageMark });
      });

    });
  });
});

router.get('/:id/edit', function (req, res, next) {
  Article.findById(req.params.id, function (err, article) {
    if (err) return next(err);

    res.render('articles/edit', { article: article });
  });
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

router.post('/:id/destroy', function (req, res, next) {
  Article.remove({ _id: req.params.id }, function (err) {
    if (err) return next(err);
  });

  Article.find({ userId: req.session.currentUserId }, function (err, articles) {
    if (err) return next(err);

    res.render('articles/index', { articles: articles });
  });
});

router.post('/:id/mark', function (req, res, next) {
  var articleId = req.params.id;
  var userId = req.session.currentUserId;
  var number = req.body.rating;

  var mark = new Mark({ articleId: articleId, userId: userId, number: number });
  mark.save(function (err) {
    if (err) return next(err);
  });

  res.send({});
});

router.post('/:id/mark/destroy', function (req, res, next) {
  var articleId = req.params.id;
  var userId = req.session.currentUserId;

  Mark.remove({ userId: userId, articleId: articleId }, function (err) {
    if (err) return next(err);
    res.send({});
  });
});

module.exports = router;