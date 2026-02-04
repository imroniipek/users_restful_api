const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

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
    isim: Joi.string().min(3).max(150).trim().required(),
    userName: Joi.string().min(3).lowercase().trim().required(),
    sifre: Joi.string().min(6).trim().required(),
  });

  return joiSchema.validate(Objectuser);
};

const User = mongoose.model("User", userSchema);
module.exports = User;