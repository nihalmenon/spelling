const express = require('express')
const Game = require('../models/game')
const auth = require('../middleware/auth')
const { startGame } = require('../utils/play')
const { createRoom } = require('../utils/room')
const router = new express.Router()

router.get('/games', auth, async (req, res) => {
    try {
        const games = await Game.find({ player: req.user._id }).sort({ createdAt: -1 })
        res.status(200).send(games)
    } catch (e) {
        return res.status(500).send({ error: 'Something went wrong!' })
    }
})

router.get('/games/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const game = await Game.findOne({ _id, player: req.user._id }).populate('correctWords').populate('incorrectWords').populate('leaderboard.user')

        if (!game) {
            return res.status(404).send()
        }
        res.send(game)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/games/room/create', auth, async (req,res) => {
    try {
        const room = createRoom(req.user._id)
        res.status(200).send(room)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: 'Something went wrong!' })
    }
})

module.exports = router