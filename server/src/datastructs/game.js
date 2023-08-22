class Room {
    constructor(roomData = {}) {
        this.room = roomData.room
        this.players = roomData.players
        this.status = roomData.status
        this.owner = roomData.owner
        this.words = roomData.words
        this.dateCreated = roomData.createdAt
    }
}

module.exports = {
    Room
}
