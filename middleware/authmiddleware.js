const jwt = require("jsonwebtoken");
const userdb=require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) 
    {
      throw new Error("Token yok");
    }

    const token = authHeader.split(" ")[1];
    console.log("gelen token:", token);

    const decoded = jwt.verify(token, "secretkey");

    const id = decoded._id;

    req.user = await userdb.findById(id);

    if (!req.user) 
    {
      throw new Error("Kullanıcı bulunamadı");
    }

    next();
  } 
  catch (err) 
  {
    res.status(401).json({ message: "Yetkisiz" });
  }
};
