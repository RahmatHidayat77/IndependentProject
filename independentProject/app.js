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
var usersRouter = require('./routes/users');
var app = express();
//route model database
var user = require('./models/user');
var jadwal = require('./models/jadwal&tiket');

var session = require('express-session');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
var ejs = require('ejs');
//new
var loginController = require('./controller/loginController');
var favicon = require('serve-favicon');


//mongose connect
mongoose.connect('mongodb://localhost/konserdb');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/images/icon.png'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//session
app.use(session({
  secret: 'kjnjbibiubjb',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

//login
app.use('/', loginController);
app.use('/users', usersRouter);

/*
//page link
app.get('/register', (req, res) => {
  res.render('register')
})
app.get('/login', (req, res) => {
*/

// post register
app.post('/register', function (req, res) {
  console.log(req.query)
  var user_instance = new user()
  user_instance.first_name = req.body.first_name;
  user_instance.last_name = req.body.last_name;
  user_instance.pnumber = req.body.pnumber;
  user_instance.email = req.body.email;
  user_instance.password = req.body.password;
  user_instance.save(function (err) {
    if (err) {
      return console.log(err)
    }
    res.redirect('/')
  })
});

//post adminInput
app.post('/adminInput', function (req, res) {
  // console.log(req.body)
  var jadwal_instance = new jadwal()
  jadwal_instance.tanggal = req.body.tanggal;
  jadwal_instance.nama = req.body.nama;
  jadwal_instance.tempat = req.body.tempat;
  jadwal_instance.platinum.harga = req.body.hargaPlatinum;
  jadwal_instance.platinum.stok = req.body.stokPlatinum;
  jadwal_instance.gold.harga = req.body.hargaGold;
  jadwal_instance.gold.stok = req.body.stokGold;
  jadwal_instance.silver.harga = req.body.hargaSilver;
  jadwal_instance.silver.stok = req.body.stokSilver;
  jadwal_instance.bronze.harga = req.body.hargaBronze;
  jadwal_instance.bronze.stok = req.body.stokBronze;
  jadwal_instance.save(function (err, data) {
    if (err) {
      return console.log(err)
    }
    console.log(data)
    res.redirect('/adminInput')
  })
});

//get adminInput
app.get('/jadwal', function (req, res) {
  user.find({})
    .then(data => {
      res.json(data)
    });
})

//get register
app.get('/user', function (req, res) {
  user.find({})
    .then(data => {
      res.json(data)
    });
})

//get login
app.get('/logindb', function (req, res) {
  res.redirect('/');
});

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
