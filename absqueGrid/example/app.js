var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser')
  fs = require('fs'),
  chalk = require('chalk');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
require('./server/routes/index.server.routes');


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
    res.status(500).send(err);
  });
}


/*
  * Get the envrionment parameters
*/
//development
if(app.get('env') === 'development'){
  fs.readFile('./server/devConfig.json', 'utf8', function(error, data){
    if(error){
      error
      console.log(chalk.bold.red(carpathia.translate(translations, 'eng', 'error') + ' ->'));
      console.log(chalk.red(error));
      return {      
        type: 'error',
        description: 'Error while was reading the configuration file.',
        details: error
      }
    }

    global.defaultConfig = JSON.parse(data);
  });
}


/****************************************/


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status('500').send(
    {
      message: err.message,
      error: {}
    });
});


module.exports = app;

