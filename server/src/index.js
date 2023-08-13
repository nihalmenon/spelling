const express = require('express')
const http = require('http')
require('./db/mongoose')
const userRouter = require('./routers/user')
const wordRouter = require('./routers/word')
const gameRouter = require('./routers/game')
const cors = require('cors')
const User = require('./models/user')
const Word = require('./models/word')
const Game = require('./models/game')

const socketio = require('socket.io')
const { startGame, finishGame } = require('./utils/play')
const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers } = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ["GET", "POST"]
  }
})

const port = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET','POST','DELETE','UPDATE','PATCH','OPTIONS']
}));

app.use(express.json())
app.use(userRouter)
app.use(wordRouter)
app.use(gameRouter)


// single player 
io.on('connection', (socket) => {
  console.log('new web socket connection: ' + socket.id)

  socket.on('game_start', async ({ playerId, duration }, callback) => {
    try {
      const game = await startGame({ playerId, duration })
      const { error, user } = addUser({ id: socket.id, playerId: game.player, room: game.room, gameId: game._id })

      if (error) {
        return callback({error})
      }

      socket.join(game.room)

      // start timer
      let timeRemaining = duration
      const timer = setInterval(() => {
        if (timeRemaining < 0) {
          clearInterval(timer)
          io.to(game.room).emit('game_over')
          finishGame(socket.id)
        } else {
          io.to(game.room).emit('timer_update', timeRemaining)
          timeRemaining--
        }
      }, 1000)
      
      callback()

    } catch (e) {
      socket.emit('error', 'An error has occurred in starting the game.')
      console.log(e)
    }
  })

  socket.on('get_words', async (callback) => {
    try {
      const randomWords = await Word.aggregate([
          { $sample: { size: 30 } }
      ])
      callback(randomWords)
    } catch (e) {
      socket.emit('error', 'Something went wrong!')
      console.log(e)
    }
  })

  socket.on('submit_word', async ({input, word}, callback) => {
    try {
      const socketUser = await getUser(socket.id)
      
      if (input.trim() === word.word.trim()) {
        socketUser.correctWords.push(word._id)
      }else {
        socketUser.incorrectWords.push(word._id)
      }
      callback()
    } catch (e) {
      socket.emit('error', 'Something went wrong!')
      console.log(e)
    }
  })

  socket.on('game_stats', async (callback) => {
    try {
      const socketUser = await getUser(socket.id)
      const game = await Game.findById(socketUser.gameId).populate('correctWords').populate('incorrectWords')

      stats = {
        score: game.score,
        duration: game.duration,
        correctWords: game.correctWords, 
        incorrectWords: game.incorrectWords
      }

      callback({ stats })
    } catch (e) {
      callback({ error: 'Something went wrong!'})
      // socket.emit('error', 'Something went wrong!')
      console.log(e)
    }
  })

})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})