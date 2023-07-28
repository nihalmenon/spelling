const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const userRouter = require('./routers/user')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET','POST','DELETE','UPDATE','PATCH','OPTIONS']
}));

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})