var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var Article = require('../models/article').Article;

router.get('/', function(req, res, next) {
  User.find({}, function (err, users) {
    if (err) return next(err);

    res.render('users/index', { users: users });
  });
});

router.get('/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);

    res.render('users/show', { user: user });
  });
});

router.get('/:id/edit', function (req, res, next) {
  res.render('users/edit');
});

router.post('/:id/edit', function (req, res, next) {
  var username = req.body.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var city = req.body.city;
  var paramsId = req.params.id;

  User.update(req.currentUser, username, firstName, lastName, city, paramsId, function (err, user) {
    if (err) return next(err);
  });

  res.send({});
});

router.get('/:id/articles', function (req, res, next) {
  Article.find({ userId: req.params.id }, function (err, articles) {
    if (err) return next(err);

    res.render('articles/index', { articles: articles });
  });
});

router.post('/:id/destroy', function (req, res, next) {
  User.remove({ _id: req.params.id }, function (err) {
    if (err) return next(err);
  });

  res.locals.currentUser = null;
  res.render('index', { title: 'Blog ne Bloggera' });
});

module.exports = router;
