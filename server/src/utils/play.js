const { ObjectId } = require('mongodb')
const Game = require('../models/game')
const User = require('../models/user')
const { removeUser, getAllUsers, getUser } = require('../utils/user')

const createGame = async ({ playerId, duration, room }) => {
    try {
        const game = new Game()
        game.player = playerId
        game.duration = duration
        game.status = 'pending'
        if (room) game.room = room
        await game.save()
        return game
    } catch (e) {
        console.log(e)
    }
}

const startGame = async ({ playerId, duration, room }) => {
    try {
        const game = new Game({ player: playerId, duration, status: 'inProgress' })
        game.player = playerId
        game.duration = duration
        game.status = 'inProgress'
        if (room) game.room = room
        await game.save()
        return game
    } catch (e) {
        console.log(e)
    }
}

const finishGame = async (socketId) => {
    const socketUser = await getUser(socketId)
    const game = await Game.findById(socketUser.gameId)

    // finish games
    game.status = 'completed'
    socketUser.correctWords.forEach((word) => game.correctWords.push(word))
    socketUser.incorrectWords.forEach((word) => game.incorrectWords.push(word))
    game.wordCount = socketUser.correctWords.length + socketUser.incorrectWords.length
    game.score = socketUser.correctWords.length
    await game.save()
    // append all new words to user's correct and incorrect words
    const user = await User.findById(socketUser.playerId)
    socketUser.correctWords.forEach((id) => {
        if (user.correctWords.findIndex(wordId => wordId === id) === -1) user.correctWords.push(id)
    })

    socketUser.incorrectWords.forEach((id) => {
        if (user.incorrectWords.findIndex(wordId => wordId === id) === -1) user.incorrectWords.push(id)
    })
    await user.save()

    runGameAnalysis( { socketId } )

    setTimeout(() => {
        removeUser(socketId)
    }, 30000)
}

// upgrade player level, identify weaknesses and words
const runGameAnalysis = async ( { socketId }) => {
    return // temporary
}

module.exports = {
    startGame,
    finishGame
}