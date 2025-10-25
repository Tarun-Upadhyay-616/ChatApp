import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieparser from "cookie-parser"
import authroutes from "./routes/AuthRoutes.js"
import contactsroutes from "./routes/ContactsRoutes.js"
import setupSocket from "./socket.js"
import messageroutes from "./routes/MessageRoutes.js"
import path from "path"
dotenv.config()

const port  = process.env.PORT || 3005
const dburl = process.env.DATABASE_URL
const _dirname = path.resolve()
const app = express()
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true
}))
app.use(cookieparser())
app.use(express.json())
app.use('/uploads/profiles',express.static("uploads/profiles"))
app.use('/uploads/files',express.static("uploads/files"))
app.use('/api/auth',authroutes)
app.use('/api/contacts',contactsroutes)
app.use('/api/message',messageroutes)
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('/*splat',(_,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
app.get("/",(req,res)=>{
    res.send("Working")
})
mongoose.connect(dburl)
    .then(console.log("mongodb connected"))
    .catch((err)=>{
        console.log(err.message);
    })
const server = app.listen(port,()=>{
    console.log(`App listening on http://localhost:${port}`)
})
setupSocket(server)