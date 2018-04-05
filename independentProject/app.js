var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var user = require('./models/user');
var session = require('express-session');

//mongose connect
mongoose.connect('mongodb://localhost/konserdb');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

//page link
app.get('/register', (req, res) => {
  res.render('register')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/index', (req, res) => {
  res.render('index')
})
app.get('/tentang', (req, res) => {
  res.render('tentang')
})
app.get('/jadwalkonser', (req, res) => {
  res.render('jadwalkonser')
})
app.get('/kontakadmin', (req, res) => {
  res.render('kontakadmin')
})

// post register
app.post('/register', function (req, res) {
  console.log(req.query)
  var user_instace = new user()
  user_instace.first_name = req.body.first_name;
  user_instace.last_name = req.body.last_name;
  user_instace.pnumber = req.body.pnumber;
  user_instace.email = req.body.email;
  user_instace.password = req.body.password;
  user_instace.save(function (err){
    if (err) {
      return console.log(err)
    }
    res.redirect('/')
  })
  

})
//get register
app.get('/user', function (req, res) {
  user.find({})
  .then(data => {
    res.json(data)
  });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
