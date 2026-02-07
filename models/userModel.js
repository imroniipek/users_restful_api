const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
var createError=require("http-errors");


const userSchema = new Schema(
  {
    isim: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    userName: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3 },
    sifre: { type: String, required: true, trim: true, minlength: 6 }
  },
  { collection: "kullanicilar", timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;    
    delete ret._id;    
    delete ret.sifre;   
    delete ret.__v;     
    delete ret.createdAt,
    delete ret.updatedAt
    return ret;          
  },
});

userSchema.statics.validateValues = function (Objectuser) {
  const joiSchema = Joi.object({
    isim: Joi.string().min(3).max(150).trim(),
    userName: Joi.string().min(3).lowercase().trim(),
    sifre: Joi.string().min(6).trim(),
  });
  return joiSchema.validate(Objectuser);
};



const loginJoiSchema = Joi.object({
  userName: Joi.string().min(3).trim().required(),
  sifre: Joi.string().min(6).trim().required()
});

userSchema.statics.GirisYap = async function (userName, sifre) {

  const { error, value } = loginJoiSchema.validate({ userName, sifre });
  if(error)
  {
    throw createError(400,"Gecerisz userName veya Sifre Formati");
  }
  const user = await this.findOne({ userName });

  if (!user) {
    throw createError(400, "Kullanıcı Adı veya Şifre Hatalı");
  }

  const passwordControl = await bcrypt.compare(sifre, user.sifre);

  if (!passwordControl) {
    throw createError(400, "Kullanıcı Adı veya Şifre Hatalı");
  }

  return user;
};
userSchema.methods.generateToken = function () { 
  const token = jwt.sign(
    { 
      _id: this._id, 
    },
    'secretkey', 
    { expiresIn: "1h" }
  );

  return token;
};


const User = mongoose.model("User", userSchema);
module.exports = User;