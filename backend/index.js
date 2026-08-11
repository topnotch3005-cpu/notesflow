
const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const PORT = 9000;
const cors = require('cors')
const connectDB = require("./db/db")
const userRouter = require("./routes/userRouter")
const notesRouter = require("./routes/notesRouter");
const cookieParser = require("cookie-parser");

const app = express()
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173",
    credentials: true}))
app.use(express.json())
connectDB();

app.use("/user", userRouter)
app.use("/note", notesRouter)




app.get("/error", (req, res) =>{
    res.status(401).send(`error`)
})

app.listen(PORT, () => console.log(`Port is running on ${PORT}`))