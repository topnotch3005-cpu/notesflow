
const express = require("express")
const router = express.Router();
const {Users} = require("../module/usermodels")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

router.post("/add", async (req, res) =>{
    try{
    const {name, email, password} = req.body.form;

        if(!name || !email || !password) return res.status(400).json({message: `all fields are required`})

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Invalid email address"
    });
}


    const existingUser = await Users.findOne({email: email}) 
    if(existingUser) return res.status(409).json({message: `email is already used`})
    const newPassword = await bcrypt.hash(password, 10)
   const newUser = new Users({
    name: name,
    email: email,
    password: newPassword
   })

   await newUser.save()
   
   res.json({message: `registered succesfully`})
   }
   catch(err){
    res.status(401).json({message: `error`})
   }
})
router.post("/find", async (req, res) =>{
    try{
    const {email, password} = req.body.form;
    const selectedUser = await Users.findOne({email: email})
    if(!selectedUser){
         return res.status(401).json({message: `no user is found`})
    }
    const check = await bcrypt.compare(password, selectedUser.password)

   if(check){
    const accessToken = jwt.sign({id: selectedUser._id,
                            name: selectedUser.name,
                            email: selectedUser.email,
    }, process.env.ACCESS_TOKEN, {expiresIn: '15m'});
    const refreshToken = jwt.sign({id: selectedUser._id,
                            name: selectedUser.name,
                            email: selectedUser.email,
    }, process.env.REFRESH_TOKEN, {expiresIn: '7d'});

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: "/note/refresh",
        maxAge: 7 * 24 * 60 * 1000,
    })

   return res.json({accessToken: accessToken,message: `Welcome back! ${selectedUser.name}`})
   }
   
    return res.status(401).json({message: `password is incorrect`})
   }
   catch(err){
    return res.status(401).json({message: err.message})
   }
})

router.post("/logout", (req,res) =>{
    res.clearCookie('refreshToken', { path: '/note/refresh'});

    res.json({message: `logged out`})
})

module.exports = router; 