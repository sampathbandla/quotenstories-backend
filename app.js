const express = require("express")
const app = express()
require('dotenv').config()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

app.listen(process.env.PORT|3000,(err) => {
    if(err) throw err
    console.log("App Started!");
})