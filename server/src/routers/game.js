const express = require('express')
const Game = require('../models/game')
const auth = require('../middleware/auth')
const { startGame } = require('../utils/play')
const router = new express.Router()

router.post('/game/create', auth, async (req, res) => {
    try {
        let games = []
        req.body.users.forEach((id) => {
            let game = startGame({ playerId: id, duration: req.body.duration, room: req.body.room })
            games.push(game)
        })
        return games
    } catch (e) {
        return res.status(500).send({ error: 'Something went wrong!' })
    }
})

router.get('/games', auth, async (req, res) => {
    try {
        const games = await Game.find({ player: req.user._id }).populate('correctWords').populate('incorrectWords')
        res.status(200).send(games)
    } catch (e) {
        return res.status(500).send({ error: 'Something went wrong!' })
    }
})

module.exports = router