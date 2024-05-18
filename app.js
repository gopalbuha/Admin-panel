require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require("body-parser");
var session = require('express-session');
var mongoose = require("mongoose");
var mongoDBsession = require("connect-mongodb-session")(session);
var exphbs = require('express-handlebars');
var app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  // useCtreateIndex: true,
  // useUnifiedTopology: true
})
  .then((res) => {
    console.log('database connected successfully');
  });
var store = new mongoDBsession({
  uri: (process.env.DATABASE_URL),
  collection: 'mySessions'
})
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
  store: store,
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
