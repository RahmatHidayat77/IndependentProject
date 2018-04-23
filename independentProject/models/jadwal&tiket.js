var mongoose = require('mongoose');

var jadwalSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  tanggal: String,
  nama: String,
  tempat: String,
  platinum: {
    harga: Number,
    stok: Number
  },
  gold: {
    harga: Number,
    stok: Number
  },
  silver: {
    harga: Number,
    stok: Number
  },
  bronze: {
    harga: Number,
    stok: Number
  }
});

/*
var tiketPlatinumSchema = new mongoose.Schema({
  harga: Number,
  stok: Number
})
var tiketGoldSchema = new mongoose.Schema({
  harga: Number,
  stok: Number
})
var tiketSilverSchema = new mongoose.Schema({
  harga: Number,
  stok: Number
})
var tiketBronzeSchema = new mongoose.Schema({
  harga: Number,
  stok: Number
})
var Tiket = mongoose.model('user', userSchema);
module.exports = Tiket;

var tiketSchema = new mongoose.Schema({
  jadwalSchema_id: String,
  harga: Number,
  kuota: Number,
  tipe: String
})
var Tiket = mongoose.model('tiket', tiketSchema);
module.exports = Tiket;*/

var Jadwal = mongoose.model('jadwal', jadwalSchema);
module.exports = Jadwal;
