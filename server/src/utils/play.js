const mongoose = require('mongoose')
const Game = require('../models/game')
const User = require('../models/user')
const { removeUser, getAllUsers, getUser, getUsersInRoom, getLeaderBoard } = require('../utils/user')
const { deleteRoom } = require('../utils/room')

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

const finishGame = async (socketId, rank = null, numPlayers = null, leaderboard = null) => {
    const socketUser = await getUser(socketId)
    const game = await Game.findById(socketUser.gameId)

    // finish games
    game.status = 'completed'
    socketUser.correctWords.forEach((word) => game.correctWords.push(word))
    socketUser.incorrectWords.forEach((word) => game.incorrectWords.push(word))
    game.wordCount = socketUser.correctWords.length + socketUser.incorrectWords.length
    game.score = socketUser.score
    if (rank) game.rank = rank
    if (numPlayers) game.numPlayers = numPlayers
    if (leaderboard) game.leaderboard = leaderboard
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
    }, 100000) // 1 minute buffer

}

const finishMultiplayerGame = async (room) => {
    const players = getUsersInRoom(room)
    const numPlayers = players.length;
    const leaderboard = getLeaderBoard(room).map(player => ({ user: new mongoose.Types.ObjectId(player._id), score: player.score }))
    players.sort((a,b) => b.score - a.score)

    let currentRank = 1
    let currentScore = players[0].score

    for (let i = 0; i < players.length; i++) {
        if (players[i].score < currentScore) {
            currentRank = i + 1;
            currentScore = players[i].score;
        }
        players[i].rank = currentRank;
    }

    for (let i = 0; i < players.length; i++) {
        const player = players[i]
        finishGame(player.id, players[i].rank, numPlayers, leaderboard)
    }

    // need to remove all game invites with this room
    removeGameInvitesByRoom(room)
    deleteRoom(room)
}

// upgrade player level, identify weaknesses and words
const runGameAnalysis = async ( { socketId }) => {
    return // temporary
}

const removeGameInvitesByRoom = async (room) => {
    try {
      await User.updateMany(
        { 'gameInvites.room': room },
        { $pull: { gameInvites: { room } } }
      );
    } catch (error) {
      console.error('Error removing game invites:', error);
    }
  };
  

module.exports = {
    startGame,
    finishGame,
    finishMultiplayerGame
}