const express = require('express')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.json())

const userRouter = require('./src/routes/user')
const projectRouter = require('./src/routes/project')
const apiRouter = require('./src/routes/api')
const categoryRouter = require('./src/routes/category')

app.use('/api/user', userRouter)
app.use('/api/project', projectRouter)
app.use('/api/api', apiRouter)
app.use('/api/category', categoryRouter)

app.listen(8000, () => {
  mongoose.connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  console.log('server started')
})
