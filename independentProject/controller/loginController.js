var router = require('express').Router()
var session = require('express-session');
// module.exports = (function(app){
// app.use(session({
//     secret: '2C44-4D44-WppQ38S',
//     resave: true,
//     saveUninitialized: true
// }));
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/myproject';
var User = require('../models/user');
var loginIn = false;

// Authentication and Authorization Middleware
// var authAdmin = function(req, res, next) {
//   if (req.session && req.session.user === "admin" && req.session.admin)
//     return next();
//   else
//     return res.sendStatus(401);
// };
module.exports = auth = function (req, res, next) {
  if (req.session && req.session.user === "admin" && req.session.admin) {
    return next();
  }
  else if (req.session && req.session.user) {
    console.log('tttt');
    return next();
  }
  else {
    return res.sendStatus(401);
  }
};

// Login TO DB==================================================================
router.post('/logindb', function (req, res) {
  console.log('Landing here', req.body);
  User.findOne({ email: req.body.email }, function (err, user_instance) {
    if (user_instance === null) {
      console.log("coba lagi");
      res.end("Email dan password tidak boleh kosong");
    } else if (user_instance.email && user_instance.email === req.body.email && user_instance.password && user_instance.password === req.body.password) {
      req.session.user_instance = {}
      req.session.user_instance.email = req.body.email;
      console.log(req.session)
      req.session.admin = false;
      req.session.user_instance = user_instance;
      console.log("login success!");
      loginIn = true;
      res.redirect('/jadwalkonser');
    } else {
      console.log("Credentials wrong");
      res.end("Login invalid");
    }
  });
  ;
});

//register to DB================================================================
router.post('/registerToDb', function (req, res) {
  console.log(req.body);
  res.render('profile', { loginData: req.body });
});
//register profile to MongoDB================================================================
router.post('/completeprofile', function (req, res) {
  //  var obj = JSON.stringify(req.body);
  //  console.log("Final reg Data : "+obj);
  //  var jsonObj = JSON.parse(obj);
  // MongoClient.connect(url, function(err, database) {
  // var db=database.db('myproject');
  var newUser = new User(req.body);
  newUser.save(req.body, function (err, res) {
    console.log(res)
    if (err) throw err;
    console.log("1 document inserted");
    //  db.close();
  });
  res.render('completeprofile', { profileData: req.body });
  // console.log(User)
  // console.log(obj)
  //   var newUser = new User(req.body)
  //   newUser.save(function(err, res) {
  //     console.log('success');
  //   })
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  loginIn = false;
  console.log("logout success!");
  res.redirect('/');
});

router.get('/content', auth, function (req, res) {
  res.render('completeprofile', { profileData: req.session.userprofile });
  // res.send("You can only see this after you've logged in.");
});

//router get
router.get('/', function (req, res) {
  res.render('index', { loginIn });
});
router.get('/register', function (req, res) {
  res.render('register', { loginIn });
});
router.get('/login', function (req, res) {
  res.render('login', { loginIn });
});
router.get('/jadwalkonser', (req, res) => {
  res.render('jadwalkonser', { loginIn });
});
router.get('/tentang', (req, res) => {
  res.render('tentang', { loginIn });
});
router.get('/kontakadmin', (req, res) => {
  res.render('kontakadmin', { loginIn });
});

module.exports = router;