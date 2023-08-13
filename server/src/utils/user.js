const users = []

const addUser = ({ id, gameId, playerId, room }) => {
    // Clean the data
    room = room.trim()

    if (!playerId || !room) {
        return {
            error: 'Email and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.playerId === playerId && user.room === room
    })

    if (existingUser) {
        return {
            error: 'User is already in this room.'
        }
    }

    // Add user
    const user = { id, gameId, playerId, room, correctWords: [], incorrectWords: []}
    users.push(user)
    return { user }
}

const removeUser = ( id ) =>  {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = ( id ) => {
    const user = users.find((user) => user.id === id)

    if (user) {
        return user
    }

    return {
        error: "User doesn't exist."
    }
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const getAllUsers = () => {
    return users
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAllUsers
}