var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  first_name:  String,
  last_name: String,
  pnumber:   String,
  email: String,
  password: String
});

var User = mongoose.model('user', userSchema);
module.exports = User;