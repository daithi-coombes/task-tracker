var express     = require('express')
  ,bayes        = require('bayes')
  ,path         = require('path')
  ,favicon      = require('serve-favicon')
  ,logger       = require('morgan')
  ,cookieParser = require('cookie-parser')
  ,bodyParser   = require('body-parser')
  ,mongo        = require('mongodb')

  var config      = require('./config.js')
  ,classifier  = bayes()


/**
 * passport
 */
var mongoose = require('mongoose')
  ,passport = require('passport')
  ,LocalStrategy = require('passport-local').Strategy
//end passport


/**
 * Machine Learning.
 */
classifier.learn('amazing, awesome movie!! Yeah!! Oh Boy.', 'positive')
classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive')

classifier.learn('terrivle, shitty thing. Damn. Sucks!!', 'negative')

classifier.categorize('awesome, cool, amazing!! Yay.')

var stateJson = classifier.toJson()
var revivedClassifier = bayes.fromJson(stateJson)

//console.log(revivedClassifier)
// end Machine Learning


/** watch terminal-cd.log file */
var watchLog = require('./lib/watchLog')
watchLog()


// init express
var api   = require('./routes/api')
  ,routes = require('./routes/index')
  ,users  = require('./routes/users')

var app = express()
// end init express


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
// end view engine setup


/**
 * Routes.
 */
app.use('/', routes)
app.use('/api', api)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
//end Routes


/**
 * Passport config.
 */
var User = require('./models/User')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// end Passport config


// mongoose
var mongoose = mongoose.connect(config.db.host+':'+config.db.port+'/'+config.db.dbName)


/**
 * error handlers
 */
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})
//end error handlers


module.exports = app
