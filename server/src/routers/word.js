const express = require('express')
const Word = require('../models/word')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/words/save', auth, async (req,res) => {
    const word = new Word(req.body)
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).send({ error: 'You do not have the permissions for this!' })
        }

        const exists = await Word.findOne({
            word: req.body.word,
            partOfSpeech: req.body.partOfSpeech
        })

        if (exists) {
            res.status(409).send('Word already exists!')
        }else{
            await word.save()
            res.status(201).send('Word saved successfully!')
        }

    } catch (e) {
        res.status(500).send('Something went wrong!')
    }

})

router.get('/words/quick', async (req,res) => {
    const numWords = 30;
    try {
        const randomWords = await Word.aggregate([
            { $sample: { size: numWords } }
        ])
        
        res.status(200).send(randomWords)
    } catch (e) {
        res.status(500).send('Something went wrong!')
    }
})

module.exports = router