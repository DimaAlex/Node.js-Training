var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

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
  var password = req.body.password;

  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);

    if (user) {
      user.username = username;

      user.save(function(err) {
        if (err) throw err;
      });
    }
  });

  res.send({});
});

module.exports = router;
