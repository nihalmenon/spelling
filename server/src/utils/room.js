const { nanoid } = require('nanoid')
const { Room } = require('../datastructs/game')
const { ObjectId } = require('mongodb')
const rooms = {}

const createRoom = (userId) => {
    const roomName = nanoid(6)
    if (rooms[roomName]) {
        return {
            error: "Room already exists."
        }
    }else {
        const room = new Room({ room: roomName, status: 'inPending', players: [], owner: userId, words: [], dateCreated: new Date() })
        rooms[roomName] = room
        return room
    }
}

const addUserToRoom = (roomName, socketId, userId, name) => {
    if (rooms[roomName]) {
        if (rooms[roomName].players.findIndex(p => p.socketId === socketId) === -1) rooms[roomName].players.push({socketId, name, _id: userId})
        const players = rooms[roomName].players
        let owner = false
        if (rooms[roomName].owner.equals(new ObjectId(userId))) {
            owner = true
        }
        return {
            owner,
            players
        }
    } else {
        return {
            error: "Room doesn't exist."
        }
    }
}

const removeUserFromRoom = (socketId) => {
    let players;
    let room;

    Object.keys(rooms).forEach((r) => {
        const index = rooms[r].players.findIndex(p => p.socketId === socketId);

        if (index !== -1) {
            rooms[r].players.splice(index, 1);
            players = rooms[r].players
            room = r
        }
    });
    
    return { players, room }

}

const getPlayersFromRoom = (room) => {
    if (rooms[room]) {
        return {players: rooms[room].players}
    }
    return { error: 'Something went wrong!' }
}

const addWordsToRoom = (room, words) => {
    rooms[room].words = rooms[room].words.concat(words);
    return rooms[room].words;
};

const updatePlayerScoreInRoom = (roomName, socketId) => {
	if (rooms[roomName]) {
		const playerIndex = rooms[roomName].players.findIndex(player => player.socketId === socketId);

		if (playerIndex !== -1) {
			rooms[roomName].players[playerIndex].score += 1;
			return { players: rooms[roomName].players};
		}
	}

	return { error: 'User not found!' }; 
};

const deleteRoom = (roomName) => {
    delete rooms.roomName
}

module.exports = {
    addUserToRoom,
    createRoom,
    removeUserFromRoom,
    getPlayersFromRoom,
    addWordsToRoom,
    updatePlayerScoreInRoom,
    deleteRoom
}