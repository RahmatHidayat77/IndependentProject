var router = require('express').Router()
var session = require('express-session');
var User = require('../models/user');
var Jadwal = require('../models/jadwal&tiket')
var loginIn = false;
var platinum = null, gold = null, silver = null, bronze = null;
var authentication = require('./authentification')

// Login TO DB
router.post('/logindb', function (req, res) {
  console.log('Landing here', req.body);
  User.findOne({ email: req.body.email }, function (err, user_instance) {
    if (user_instance === null) {
      console.log("field kosong");
      res.redirect('/loginErr');
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
      res.redirect('/loginErr');
    }
  });
});

//Login to Admin
router.post('/loginAdmin', function (req, res) {
  console.log('Landing here', req.body);
  let username = 'Rahasia';
  let password = 'Sekali';
  if (req.body === null) {
    console.log("field kosong");
    res.redirect('/loginErrAdmin');
  } else if (username === req.body.username && password === req.body.password) {
    // req.session = {}
    // req.session = req.body.username;
    // console.log(req.session)
    //req.session.username = username;
    // console.log("login success 1 !", res);
    //loginIn = true;
    console.log("login success!");
    res.redirect('/adminInput');
  } else {
    console.log("Credentials wrong");
    res.redirect('/loginErrAdmin');
  }
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

/*router.get('/content', auth, function (req, res) {
  res.render('completeprofile', { profileData: req.session.userprofile });
  // res.send("You can only see this after you've logged in.");
});*/

//auth
function checkAuth(req, res, next) {
  if (!loginIn) {
    res.redirect('../loginfirst');
  } else {
    next();
  }
}

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
  Jadwal.find({}, (err, data) => {
    console.log(data);
    if (err) { console.log(err) }
    res.render('jadwalkonser', { loginIn, data });
  });
});
router.get('/tentang', (req, res) => {
  res.render('tentang', { loginIn });
});
router.get('/kontakadmin', (req, res) => {
  res.render('kontakadmin', { loginIn });
});
router.get('/loginErr', (req, res) => {
  res.render('loginErr', { loginIn });
});
router.get('/loginErrAdmin', (req, res) => {
  res.render('loginErrAdmin', { loginIn });
});

//jumlah input
router.post('/inputP', function (req, res) {
  Jadwal.findById(req.body.event_id, (err, data) => {
    console.log(req.body)
    console.log('Landing here', data);
    data.platinum.stok = data.platinum.stok - req.body.platinum;
    data.save((err, data) => {
      if (err) { console.log(err) }
      res.redirect('/pesan/' + req.body.event_id);
    })
  })
});
router.post('/inputG', function (req, res) {
  Jadwal.findById(req.body.event_id, (err, data) => {
    console.log('Landing here', req.body);
    data.gold.stok = data.gold.stok - req.body.gold;
    data.save((err, data) => {
      if (err) { console.log(err) }
      res.redirect('/pesan/' + req.body.event_id);
    })
  })
});
router.post('/inputS', function (req, res) {
  Jadwal.findById(req.body.event_id, (err, data) => {
    console.log('Landing here', req.body);
    data.silver.stok = data.silver.stok - req.body.silver;
    data.save((err, data) => {
      if (err) { console.log(err) }
      res.redirect('/pesan/' + req.body.event_id);
    });
  });
});
router.post('/inputB', function (req, res) {
  Jadwal.findById(req.body.event_id, (err, data) => {
    console.log('Landing here', req.body);
    data.bronze.stok = data.bronze.stok - req.body.bronze;
    data.save((err, data) => {
      res.redirect('/pesan/' + req.body.event_id);
    })
  })
});

router.get('/hapusJadwal/:id',(req, res) => {
  Jadwal.findByIdAndRemove(req.params.id, (err, data) => {
    console.log('Landing here : get hapus');
    console.log(data);
    //data.remove();
    if (err) { console.log(err) }
    res.redirect('/jadwalkonserAdmin');
  });
});

router.get('/pesan/:id',(req, res) => {
  Jadwal.findById(req.params.id, (err, data) => {
    console.log('Landing here : get pesan');
    console.log(data);
    if (err) { console.log(err) }
    res.render('pesan', { loginIn, data, location: req.params.id});
  });
});

router.get('/loginfirst', (req, res) => {
  res.render('loginfirst', { loginIn });
});
router.get('/loginAdmin', (req, res) => {
  res.render('loginAdmin', { loginIn });
});
router.get('/adminInput', (req, res) => {
  res.render('adminInput', { loginIn });
});
router.get('/jadwalkonserAdmin', (req, res) => {
  Jadwal.find({}, (err, data) => {
    console.log(data);
    if (err) { console.log(err) }
    res.render('jadwalkonserAdmin', { loginIn, data });
  });
});



module.exports = router;