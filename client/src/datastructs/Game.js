export class Game {
    constructor(gameData = {}) {
        this._id = gameData._id
        this.player = gameData.player
        this.wordCount = gameData.wordCount
        this.score = gameData.score
        this.correctWords = gameData.correctWords
        this.incorrectWords = gameData.incorrectWords
        this.duration = gameData.duration
        this.status = gameData.status
        this.room = gameData.room
        this.createdAt = gameData.createdAt
    }
}