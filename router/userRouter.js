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

module.exports = router;