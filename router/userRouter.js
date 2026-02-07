const express = require('express')
const router=express.Router();
const bcrypt=require("bcrypt");
const userDb = require("../models/userModel");
const authMiddleWare = require("../middleware/authmiddleware");
var createEror=require("http-errors");
const User = require('../models/userModel');

router.get('/', async (req, res, next) => {
  const usersFromDb = await userDb.find({});
  if (usersFromDb.length === 0) 
    {
    const err = new Error("Veritabanında hiç veri yok");
    err.statusCode = 404;
    return next(err);
   }
  res.status(200).json(usersFromDb);
});
router.get('/me',authMiddleWare,(req,res,next) =>
{

  res.json({
    "Bulunan Kullanıcı":req.user
  }
  );

});


router.patch('/guncelle',authMiddleWare, async(req,res,next)=>
{
  try
  {
     req.user.sifre=await hashThePassword(req.body.sifre);

     const result=await userDb.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
      new: true,
      runValidators: true,
      }
     );
     if(!result)
     {
      next(error);
     }

      res.status(200).json({
      mesaj: "Bilgiler güncellendi",
      user: result.toJSON(),
    });
  }
  catch(error)
  {
    next(error);
  }
});

router.post('/ekle', async (req, res, next) => {
  const { error, value } = userDb.validateValues(req.body);
  if (error) 
    {
    error.hatakodu = 400; 
    return next(error);
  }
  try {

   const hashedPassword=await bcrypt.hash(value.sifre,8);
   value.sifre=hashedPassword;
   
    const yeniKullanici = await userDb.create(value); 
    
    res.status(201).json({
      mesaj: "Veri başarıyla kaydedildi",
      alinanVeri: yeniKullanici.toJSON()
    });
  } catch (err) 
  {
    next(err);
  }
});

router.delete('/:id',async (req,res,next)=>{

    try{
         const sonuc=await userDb.findByIdAndDelete(req.params.id)

         if(sonuc)
         {
             return res.status(200).json({
                mesaj:"İşlem Basarili",
             });
         }
         else
         {
            const error=new Error("Hata olustu");
            error.hatakodu=405; //Bunu tamamen bir ornek olması icin yaptımm
           throw error;
         }
    }
    catch(error)
    {
        next(error);
    }
});
    
router.patch("/:id", async (req, res, next) => {
  try {

    if (req.body.sifre) 
      {
      req.body.sifre = await bcrypt.hash(req.body.sifre, 8);
     }

    const guncelKullanici = await userDb.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!guncelKullanici) {
      const err = new Error("Kullanıcı bulunamadı");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      mesaj: "Kullanıcı Güncellenmiştir",
      guncelKullanici,
    });
  } catch (err) {
    next(err);
  }
});
router.post('/sifrekontrol', async (req, res, next) => {
    const { id, sifre } = req.body;

    try {
        const user = await userDb.findById(id);

        if (!user) {
            const error = new Error("Kullanıcı Bulunamadı");
            error.statusCode = 404;
            return next(error);
        }
        const sifreDogruMu = await bcrypt.compare(sifre, user.sifre);

        if (sifreDogruMu) 
          {
            return res.status(200).json({
                mesaj: "Kullanıcı Doğrulandı",
                user: user.toJSON() 
            });
          } 
          else 
            {
            const girisError = new Error("Kullanıcı Veya Sifre Hatalidir");
            girisError.statusCode = 401;
            return next(girisError);
           }

    } catch (error) {
        next(error);
    }
});

router.post('/giris', async (req, res, next) => {
  try {
    
    const user = await userDb.GirisYap(req.body.userName, req.body.sifre);
    const token = user.generateToken(); 

    res.status(200).json({
      "user": user, 
      "token": token
    });
  } catch (error) {
    next(error);
  }
});
async function girisVarMi(userId) 
{
    try {
        const user = await userDb.findById(userId);
        return user ? user.sifre : null;
    } 
    catch (error) 
    {
        return null; 
    }
}

async function hashThePassword(userPassword) {
   
    const salt = await bcrypt.genSalt(8);
    const newPassword = await bcrypt.hash(userPassword, salt);
    return newPassword;
}
module.exports = router;