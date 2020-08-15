const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const bodyParser = require("body-parser")
const db = require("./controllers/db")
const userRouter = require("./routers/user")
app.use(bodyParser.json({ extended: false }))

app.use(cors())

app.listen(process.env.PORT,(err) => {
    if(err) throw err
    console.log("App Started!");
})

app.use("/user",userRouter)