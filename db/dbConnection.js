const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/restful_api')
  .then(() => console.log("Veritabanına bağlanıldı"))
  .catch(err => console.log("Bağlantı hatası:", err));
