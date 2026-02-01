const router = require('express').Router();
const userDb = require("../models/userModel");
var createEror=require("http-errors");

router.get('/', async (req, res, next) => {
  const usersFromDb = await userDb.find({});
  if (usersFromDb.length === 0) {
    const err = new Error("Veritabanında hiç veri yok");
    err.statusCode = 404;
    return next(err);
  }
  res.status(200).json(usersFromDb);
});
router.post('/ekle', async (req, res, next) => {
  const { error, value } = userDb.validateValues(req.body);
  if (error) 
    {
    error.hatakodu = 400; 
    return next(error);
  }
  try {
   
    const yeniKullanici = await userDb.create(value); 
    
    res.status(201).json({
      mesaj: "Veri başarıyla kaydedildi",
      alinanVeri: yeniKullanici
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

router.patch('/:id', async (req, res, next) => {
  /*const allowedFields = ["isim", "userName"];
  const updates = {};

  for (const key in req.body) {
    if (!allowedFields.includes(key)) 
      {
      const err = new Error(`${key} alanı güncellenemez`);
      err.statusCode = 400;
      return next(err);
    }
    updates[key] = req.body[key];
  }

  if (updates.length === 0) 
    {
    const err = new Error("Güncellenecek geçerli alan bulunamadı");
    err.statusCode = 400;
    return next(err);
  }
*/
  const { error, value } = userDb.validateForUpdate(updates);
  if (error) {
    error.statusCode = 400;
    return next(error);
  }

  try {
    const guncelKullanici = await userDb.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!guncelKullanici) {
      const err = new Error("Kullanıcı bulunamadı");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json(guncelKullanici);
  } catch (err) {
    next(err);
  }
});

module.exports = router;