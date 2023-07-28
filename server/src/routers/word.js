const express = require('express')
const Word = require('../models/word')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/words/save', auth, async (req,res) => {
    try {
        const newWord = req.body.word
        if (req.user.savedWords.includes(newWord)) {
            return res.status(400).send('Word already exists!')
        }
        req.user.savedWords.push(newWord)
    } catch (e) {
        res.status(500).send('Something went wrong!')
    }

})

module.exports = router