var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');

var HttpError = require('error').HttpError;

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var config = require('config');
var mongoose = require('./libs/mongoose');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
var checkAuth = require('./middleware/checkAuth');

app.use('/', require('./routes/index'));

var users = require('./routes/users');
app.use('/users', users);

var login = require('./routes/login');
app.use('/login', login);

var logout = require('./routes/logout');
app.use('/logout', logout);

var chat = require('./routes/chat');
app.use('/chat', checkAuth, chat);

// error handlers
app.use(function(err, req, res, next) {
  if (typeof  err == 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      errorhandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;
