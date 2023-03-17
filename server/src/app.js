const express = require('express')
require('./db/mongoose')

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req,res) => {
    res.send("Hello world!")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})