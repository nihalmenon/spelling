const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const wordRouter = require('./routers/word')
const gameRouter = require('./routers/game')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET','POST','DELETE','UPDATE','PATCH','OPTIONS']
}));

app.use(express.json())
app.use(userRouter)
app.use(wordRouter)
app.use(gameRouter)

module.exports = app