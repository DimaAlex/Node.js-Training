var express = require('express');
var router = express.Router();
var Article = require('../models/article').Article;
var User = require('../models/user').User;
var Mark = require('../models/mark').Mark;
var Comment = require('../models/comment').Comment;
var arrayUniqueById = require('../lib/arrayUniqueById');

router.get('/', function(req, res, next) {
  Article.find().sort({created: -1}).populate('user').exec(function(err, articles) {
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

  Article.create(title, body, req.currentUser, function (err) {
    if (err) return next(err);
  });

  res.send({});
});

router.post('/search', function (req, res, next) {
  var searchString = req.body.search;

  if (searchString) {
    var searchParams = (searchString == "") ? {} : { $text: { $search: searchString }};
    Article.find(searchParams).limit(20)
        .populate({ path: 'user', select: 'username' })
        .exec(function (err, articles) {
          if (err) return next(err);

          User.find(searchParams).limit(20)
              .populate('articles')
              .exec(function (err, users) {
                if (err) return next(err);
                var allArticles = articles;
                users.forEach(function (user) {
                  allArticles = articles.concat(user.articles);
                });
                res.render('articles/partials/listOfArticles', { articles: arrayUniqueById(allArticles) });
              });
        });
  }
  else
    res.send({});
});

router.get('/:id', function (req, res, next) {
  var averageMark = 0;
  var numbers = [];

  Article.findById(req.params.id).populate('user').populate('marks').populate({
    path: 'comments',
    model: 'Comment',
    populate: {
      path: 'user',
      model: 'User'
    }}).exec(function (err, article) {
    if (err) return next(err);

    article.marks.forEach(function (mark) {
      numbers.push(mark.number);
    });
    if (numbers.length > 0) {
      var sum = numbers.reduce(function (a, b) {
        return a + b;
      });
      averageMark = sum / numbers.length;
    }

    Mark.findOne({ article: article, user: req.currentUser }, function (err, mark) {
      if (err) next(err);

      var markValue = mark ? mark.number : 0;

      res.render('articles/show', { article: article, markValue: markValue, averageMark: averageMark,
        comments: article.comments
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
  
  Article.update(req.params.id, title, body, function (err, article) {
    if (err) return next(err);
  });

  res.send({});
});

router.post('/:id/destroy', function (req, res, next) {
  Article.destroy(req.params.id, function (err) {
    if (err) return next(err);
  });

  res.redirect('/articles');
});

router.post('/:id/mark', function (req, res, next) {
  var articleId = req.params.id;
  var user = req.currentUser;
  var number = req.body.rating;

  Article.findById(articleId, function (err, article) {
    if (err) return next(err);

    Mark.create(number, user, article, function (err) {
      if (err) return next(err);
    });
  });

  res.send({});
});

router.post('/:id/mark/destroy', function (req, res, next) {
  var articleId = req.params.id;
  var user = req.currentUser;

  Article.findById(articleId, function (err, article) {
    Mark.destroy(user, article, function (err) {
      if (err) return next(err);
    });
  });

  res.send({});
});

router.post('/:id/comment', function (req, res, next) {
  var articleId = req.params.id;
  var user = req.currentUser;
  var message = req.body.message;

  Article.findById(articleId, function (err, article) {
    if (err) return next(err);

    Comment.create(message, user, article, function (err, comment) {
      if (err) return next(err);

      var io = req.app.get('socketio');
      io.sockets.in('' + articleId).emit('create comment', article.comments.length + 1);

    });
  });

  res.send({});
});

module.exports = router;