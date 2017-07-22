var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var institution = require('./bin/issuer-model');

var api = require('./routes/api');
var institutionRoutes = require('./routes/issuer');

var app = express();

//passport auth setup
//passport config
passport.use('local', new LocalStrategy( institution.findByCred ));
passport.deserializeUser( institution.findById );
passport.serializeUser(function(institution ,done) {
  done(null,institution.id);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'ng-app/dist')));
app.use(session({
  name : 'w3certs|*|',
  secret : 'yolopurpleperceptron#!!',
  resave : true,
  saveUninitialized : true,
  cookie : { maxAge : null },
  secure: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
app.use('/institution',institutionRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // error api
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;