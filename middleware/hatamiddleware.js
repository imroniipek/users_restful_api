const hataMiddleware = (error, req, res, next) => {

  if (error.isJoi || (error.details && error.name === 'ValidationError')) 
    {
      console.log("Hatamız Join kutuphanesinden geldi");
    return res.status(400).json({
      statusCode: 400,
      message: error.details.map(d => d.message).join(", ")
    });
  }

 
  if (error.code === 11000) 
    {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      statusCode: 400,
      message: `${field} değeri zaten mevcut`
    });
  }


  if (error.name === "CastError") 
    {
    return res.status(400).json({
      statusCode: 400,
      message: "Geçersiz ID formatı"
    });
  }

  if (error.name === "ValidationError")
    {
    const messages = Object.values(error.errors).map(e => e.message).join(", ");
    return res.status(400).json({
      statusCode: 400,
      message: messages
    });
  }

  const status = error.statusCode || error.status || error.hatakodu || 500;

  res.status(status).json({
    statusCode: status,
    message: error.message || "Sunucu hatası"
  });
};

module.exports = hataMiddleware;