var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
//var stormpath = require('express-stormpath');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongo instance
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ghelp');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
function compile(str, path) {
	  return stylus(str)
	    .set('filename', path)
	    .use(nib())
	}

//Stormpath middleware here

//var stormpathMiddleware = stormpath.init(app, {
/*	  apiKeyFile: '/Users/robert/.stormpath/apiKey.properties',
	  application: 'https://api.stormpath.com/v1/applications/xxx',
	  secretKey: 'some_long_random_string',
	  expandCustomData: true,
	  enableForgotPassword: true
	});*/

//app.use(stormpathMiddleware);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(stylus.middleware(
		  { src: __dirname + '/public'
		  , compile: compile
		  }
		));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;