var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);

    res.render('users/show', { user: user });
  });
});

module.exports = router;
