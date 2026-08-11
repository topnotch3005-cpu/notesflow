
const express = require("express")
const router = express.Router();
const {Notes} = require("../module/usermodels")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares")

router.post("/get",auth, async(req, res) =>{
    try{
    const email = req.user.email
    const notes = await Notes.find({email: email});

    res.status(201).json(notes)
    }
    catch{
        res.status(401).json({message: `cant get notes`})
    }
})

router.post("/add",auth, async(req, res) =>{
    try{
    const newNote = new Notes({...req.body, email: req.user.email})


    await newNote.save()

    res.status(201).json({message: `added successfully`})
    }
    catch(err){
        res.status(401).json({message: err})
    }

})

router.post("/update", auth, async(req, res) =>{
    try{
   const{editnotesForm, editNoteId} = req.body;
   
    await Notes.findByIdAndUpdate(editNoteId, {...editnotesForm, createdAt: new Date()})

    res.status(201).json({message: `updated successfully`})
    }
    catch{
        res.status(401).json({message: `cant add note`})
    }

})

router.put("/updateStatus/:id",auth,  async(req, res) =>{
    try{
        const {id} = req.params;
        const updateFields = req.body;

        await Notes.findByIdAndUpdate(id, updateFields)
        
        return res.status(201)

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.delete("/delete/:id",auth, async(req, res) =>{
    try{
        const noteId = req.params.id;

        const email = req.user.email

    await Notes.findByIdAndDelete(noteId)

    const newNotes = await Notes.find({email: email});

    res.status(201).json(newNotes)
    }
    catch(err){
        res.status(402).json({err})
    }

})
router.get("/findOne/:id", auth, async(req, res) =>{
    try{
        const noteId = req.params.id;

     const editingNote = await Notes.findById(noteId)


    res.status(201).json(editingNote)
    }
    catch(err){
        res.status(402).json({err})
    }

})
router.post("/refresh", async(req,res) =>{

    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json({error: `no refresh token`})

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const accessToken = jwt.sign({id: decoded._id,
                            name: decoded.name,
                            email: decoded.email}, process.env.ACCESS_TOKEN, {expiresIn: '15m'});
           
        
            return res.json({accessToken: accessToken,})

    }catch(err){
        console.log(err.name, err.message)
            return res.status(403).json({message: `error!`})

    }
})


module.exports = router; 