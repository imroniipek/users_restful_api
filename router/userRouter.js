const router = require('express').Router();
const userDb = require("../models/userModel");

router.get('/', async (req, res) => {
    try {
        const usersFromDb = await userDb.find({});
        if (usersFromDb.length === 0) {
            return res.status(404).send("Veritabanında hiç veri yok");
        }
        res.status(200).json(usersFromDb);
    } catch (error) {
        console.log(error);
        res.status(500).send("Sunucu hatası");
    }
});


router.post('/ekle', async (req, res) => {
    try {

        const yeniKullanici = await userDb.create(req.body); 
        
        res.status(201).json({
            mesaj: "Veri başarıyla kaydedildi",
            alinanVeri: yeniKullanici
        });
    } catch (error) 
    {
        
        console.log("Kayıt hatası:", error);
        res.status(400).send("Veri kaydedilemedi, formatı kontrol edin.");
    }
});

router.delete('/:id',async (req,res)=>{

    try{

         console.log("Silinecek id:"+req.params.id);

         const sonuc=await userDb.findByIdAndDelete(req.params.id)


         if(sonuc)
            {
              return res.status(201).json({
                mesaj:"İşlem Basarili",
             });
            }
            else
            {

            }

    }
    catch(error)
    {
        res.status(404).send("Hata Oluştu");
    }
});

router.patch('/:id', async (req, res) => {
    try {
        
        const guncelKullanici = await userDb.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        ); 

        if (guncelKullanici) {
            return res.status(200).json(guncelKullanici); 
        } else {
            return res.status(404).json({
                mesaj: "Güncellenecek kullanıcı bulunamadı."
            });
        }
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.status(500).json({
            hata: "Sunucu hatası oluştu",
            detay: error.message
        });
    }
});


module.exports = router;