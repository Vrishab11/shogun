const nocache = require('nocache')
const cors = require('cors')
const path = require('path')
const cookieParser = require("cookie-parser")
const userRouter = require('./routes/userRoute')
const adminRouter = require('./routes/adminRoute')
const session = require('express-session')
const db = require('./config/config')
const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3500 
db.connectDB()
app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use("/public",express.static('public'))
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use("/asset",express.static(path.join(__dirname,"./asset")))
app.use('/assets',express.static(path.join(__dirname,'/assets')))
app.use('/images',express.static(path.join(__dirname,'/images')))


app.set("view engine", "ejs")

app.use(session({
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true
}))

app.use(cookieParser())

app.use(nocache())

app.use('/admin', adminRouter)
app.use('/', userRouter)

app.use("/",(req, res)=>{
    res.status(404).render('user/error404'); 
});


app.listen(port,() => {
    console.log(`Starting http://localhost:${port}`)
})