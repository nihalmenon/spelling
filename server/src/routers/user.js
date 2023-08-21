const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// for development
router.get('/users', async (req,res) => {
    try {
       const users = await User.find({})
       res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.deleteOne()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// friends
router.get('/users/friends', auth, async (req,res) => {
    try {
        await req.user.populate('friends');

        const friends = req.user.friends.map((friend) => ({
            _id: friend._id,
            name: friend.name,
            email: friend.email
        }))

        return res.status(200).send({ friends })

    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
})

router.post('/users/friends/add', auth, async (req,res) => {
    try {
        const recipientEmail = req.body['email']
        let recipientUser = await User.findOne( { email: recipientEmail } )
        if (recipientUser) {
            const inviteExists = recipientUser.friendRequests.some((request) => request.sender.toString() === req.user._id.toString() && request.status === 'pending')
            if (inviteExists) {
                return res.status(201).send()
            }
            recipientUser.friendRequests.push({ sender: req.user._id, status: 'pending' })
            await recipientUser.save()
            return res.status(201).send()
        }

        res.status(404).send('No such user exists')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/friends/accept', auth, async (req,res) => {
    try {
        const requesterId = req.body['id']
        let requester  = await User.findById(requesterId)
        if (requester) {
            const friendRequest = req.user.friendRequests.find((request) => request.sender.toString() === requesterId && request.status === 'pending')
            
            if (friendRequest) {
                friendRequest.status = 'accepted'
                await req.user.save()
                
                if (!requester.friends.some((friend) => friend._id === req.user._id)) requester.friends.push(req.user._id)
                if (!req.user.friends.some((friend) => friend._id === requester._id)) req.user.friends.push(requester._id)
                await requester.save()
                await req.user.save()
                return res.status(200).send()
            }
        }
        return res.status(400).send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/users/friends/decline', auth, async (req,res) => {
    try {
        const requesterId = req.body['id']
        const requester = User.findById(requesterId)

        if (requester) {
            const request = req.user.friendRequests.find((request) => request.sender.toString() === requesterId)
            if (request) {
                request.status = 'declined'
                await req.user.save()
                return res.status(200).send()
            }
        }
        return res.status(400).send()
    } catch (e) {
        return res.status(500).send()
    }
})

router.get('/users/friends/requests', auth, async (req,res) => {
    try {
        await req.user.populate('friendRequests.sender')


        let friendRequests = req.user.friendRequests.filter((request) => request.status === 'pending').map((request) => ({
            _id: request.sender._id,
            email: request.sender.email,
            name: request.sender.name,
            status: request.status
        }))

        return res.status(200).send(friendRequests)

    } catch (e) {
        return res.status(500).send()
    }
})

router.get('/users/games/invites', auth, async (req,res) => {
    try {
        await req.user.populate('gameInvites.sender')
        let gameInvites = req.user.gameInvites.map((invite) => ({
            _id: invite.sender._id,
            email: invite.sender.email,
            name: invite.sender.name,
            room: invite.room
        }))

        return res.status(200).send(gameInvites)
    } catch (e) {
        return res.status(500).send()
    }
})

router.post('/users/games/invites/send', auth, async (req,res) => {
    try {
        const invitee = await User.findOne({ email: req.body.email })
        invitee.gameInvites.push({ sender: req.user._id, room: req.body.room })
        await invitee.save()
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router