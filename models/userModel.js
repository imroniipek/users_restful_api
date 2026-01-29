const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({ 
  isim: {
    type: String, 
    required: [true, "İsim alanı zorunludur"],
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  userName: {
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
  },
  sifre: {
    type: String,
    required: true,
    trim: true,
    minlength: 6, 
  }
}, { collection: "kullanicilar", timestamps: true }); // timestamps ekleyerek kayıt tarihlerini otomatik tutabilirsin

const User = mongoose.model("User", userSchema);
module.exports = User; 