const app = require('./app')
const http = require('http')
const User = require('./models/user')
const Word = require('./models/word')
const Game = require('./models/game')

const socketio = require('socket.io')
const { startGame, finishGame, finishMultiplayerGame } = require('./utils/play')
const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers, getLeaderBoard } = require('./utils/user')
const { addUserToRoom, removeUserFromRoom, getPlayersFromRoom, addWordsToRoom, updatePlayerScoreInRoom } = require('./utils/room')

const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
})

const port = process.env.PORT
console.log(port)

io.on('connection', (socket) => {
  console.log('new web socket connection: ' + socket.id)

  // single player 
  socket.on('game_start', async ({ playerId, duration, playerName }, callback) => {
    try {
      const game = await startGame({ playerId, duration })
      const { error, user } = addUser({ id: socket.id, playerId: game.player, playerName, room: game.room, gameId: game._id })

      if (error) {
        return callback({ error })
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
      const socketUser = getUser(socket.id)
      
      if (input.trim() === word.word.trim()) {
        socketUser.correctWords.push(word._id)
        socketUser.score += 1
      }else {
        socketUser.incorrectWords.push(word._id)
        socketUser.score -= 1
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


  // multiplayer
  socket.on('join_room', async ({ playerId, room, name }, callback) => {
    try {
      const {error, owner, players } = addUserToRoom(room, socket.id, playerId, name)
      if (error) callback({ error: 'Something went wrong!' })
      socket.join(room)
      io.to(room).emit('update_players', players)
      callback({owner: owner})
    } catch {
      callback({ error: 'Something went wrong!'})
      console.log(e)
    }
  })

  socket.on('multiplayer_game_start', async ({room, duration, playerId}, callback) => {
    try {
       // loop through players in room to update users and create games
      const {players, error} = getPlayersFromRoom(room)
      if (error) {
        io.to(socket.id).emit('error', 'Something went wrong!')
      }
      for (let i = 0; i < players.length; i++) {
        let player = players[i]
        const game = await startGame({ playerId: player._id, duration, room })
        const { error, user } = addUser({ id: player.socketId, playerId: player._id, playerName: player.name, room: game.room, gameId: game._id })
        if (error) {
          io.to(players[i].socketId).emit('error', 'Something went wrong!')
        }
      }

      const randomWords = await Word.aggregate([
          { $sample: { size: 30 } }
      ])

      addWordsToRoom(room, randomWords)
      const leaderboard = getLeaderBoard(room)

      io.to(room).emit('multiplayer_game_started', randomWords)
      io.to(room).emit('update_leaderboard', leaderboard)

      // start timer
      let timeRemaining = duration
      const timer = setInterval(() => {
        if (timeRemaining < 0) {
          clearInterval(timer)
          io.to(room).emit('game_over')
          finishMultiplayerGame(room)
        } else {
          io.to(room).emit('timer_update', {timeRemaining, id: socket.id})
          timeRemaining--
        }
      }, 1000)

      callback()
    } catch (e) {
      socket.emit('error', 'Something went wrong!')
      console.log(e)
    }
  })

  socket.on('multiplayer_submit_word', async ({ room, input, word }, callback) => {
    try {
      const socketUser = getUser(socket.id)

      if (socketUser.error) {
        throw new Error('Something went wrong!')
      }

      if (input.trim() === word.word.trim()) {
        socketUser.correctWords.push(word._id)
        socketUser.score += 1
      }else {
        socketUser.incorrectWords.push(word._id)
        socketUser.score -= 1
      }
      
      const leaderboard = getLeaderBoard(room)

      io.to(room).emit('update_leaderboard', leaderboard)

      callback()
    } catch (e) {
      socket.emit('error', 'Something went wrong!')
      console.log(e)
    }

  })

  socket.on('get_more_words', async ({ room }, callback) => {
    const randomWords = await Word.aggregate([
        { $sample: { size: 30 } }
    ])

    addWordsToRoom(room, randomWords)
    io.to(room).emit('update_words', randomWords)

  })

  socket.on('multiplayer_game_stats', async (callback) => {
    try {
      const socketUser = getUser(socket.id)
      const game = await Game.findById(socketUser.gameId).populate('correctWords').populate('incorrectWords').populate('leaderboard.user')

      stats = {
        score: game.score,
        duration: game.duration,
        correctWords: game.correctWords, 
        incorrectWords: game.incorrectWords,
        rank: game.rank,
        numPlayers: game.numPlayers,
        leaderboard: game.leaderboard
      }
      callback({ stats })
    } catch (e) {
      callback({ error: 'Something went wrong!'})
      // socket.emit('error', 'Something went wrong!')
      console.log(e)
    }
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id)
    // const {players, room} = removeUserFromRoom(socket.id)
    // io.to(room).emit('update_players', players)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log('Server is up on port ' + port)
})

module.exports = server