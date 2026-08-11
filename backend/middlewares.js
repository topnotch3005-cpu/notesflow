const jwt = require("jsonwebtoken")

const auth = async(req, res, next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    }catch(err){
        if(err === "JsonWebTokenError"){ return res.status(401).json({message: `login first!`})}
        if(err === "TokenExpiredError"){ return res.status(401).json({message: `login first!`})}
      
            return res.status(401).json({message: `error!`})

    }
}


module.exports = auth;