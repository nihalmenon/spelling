const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    level: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot include the value password.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    }],
    correctWords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    incorrectWords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    queuedWords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequests: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'declined']
            }
        }
    ]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.timestamps
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat( { token })
    await user.save()

    return token
}

// find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}   

// hash password before saving
userSchema.pre('save', async function (next) { // can't be arrow in order to bind this
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User