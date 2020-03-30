const express = require('express')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.json())

app.listen(8000, () => {
  mongoose.connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('server started')
})
