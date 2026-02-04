
const express = require('express');
const mongoose = require('mongoose');
const middlewareFunction = require('./middleware/hatamiddleware.js');
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/restful_api')
  .then(() => console.log("Veritabanına bağlanıldı"))
  .catch(err => console.log("Bağlantı hatası:", err));

app.use(express.json());

const userRouter = require('./router/userRouter');
app.get('/', (req, res) => {
  res.send("API ayakta");
});


app.post('/kaydet', (req, res) => {
  console.log("Gelen veri:", req.body);
  res.json({
    durum: "Basarili",
    alinan: req.body
  });
});

app.use('/api/users', userRouter);

app.use(middlewareFunction);

app.listen(3000, () => {
  console.log("3000 portundan server ayaklandırıldı");
});
