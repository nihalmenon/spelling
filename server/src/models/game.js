const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const gameSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    room: {
        type: String,
        default: () => nanoid(6)
    }
    ,
    wordCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    correctWords: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Word'
    }],
    incorrectWords: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Word'
    }],
    duration: {
        type: Number, // representing duration in milliseconds
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'inProgress', 'completed', 'cancelled'],
        default: 'pending'
    },
    rank: {
        type: Number,
        default: 1
    },
    numPlayers: {
        type: Number,
        default: 1
    },
    leaderboard: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number
        }
    }]
}, {
    timestamps: true
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game