const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        const user = await User.findOne({ _id: decoded._id , 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user // save user in req so we don't need to search in db again
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth