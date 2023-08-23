const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const wordRouter = require('./routers/word')
const gameRouter = require('./routers/game')

const app = express()

console.log('frontend url ' + process.env.FRONTEND_URL)

app.use(cors({
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      console.log('origin matches frontend url', origin)
      callback(null, true);
    } else {
      console.log('not allowed by cors', origin)
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','DELETE','UPDATE','PATCH','OPTIONS']
}));

app.use(express.json())
app.use(userRouter)
app.use(wordRouter)
app.use(gameRouter)

module.exports = app