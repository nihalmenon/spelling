const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true
    }, 
    definition: {
        type: String,
        trim: true
    },
    partOfSpeech: {
        type: String,
        trim: true
    },
    sentence: {
        type: String,
        trim: true
    },
    tags: {
        type: String
    },
    zscore: {
        type: Number
    },
    meanAccuracy: {
        type: Number
    },
    correct: {
        type: Number,
        default: 0
    },
    incorrect: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Word = mongoose.model('Word', wordSchema)

module.exports = Word