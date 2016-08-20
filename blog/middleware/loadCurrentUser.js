var User = require('../models/user').User;

module.exports = function (req, res, next) {
  req.currentUser = res.locals.currentUser = null;

  if (!req.session.currentUserId) return next();

  User.findById(req.session.currentUserId, function (err, currentUser) {
    if (err) return next(err);

    req.currentUser = res.locals.currentUser = currentUser;
    next();
  });
};