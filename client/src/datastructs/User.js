export class User {
    constructor(userData = {}) {
        this._id = userData._id
        this.name = userData.name
        this.email = userData.email
        this.role = userData.role
        this.friends = userData.friends
        this.correctWords = userData.correctWords
        this.friendRequests = userData.friendRequests
        this.score = userData.score
        this.level = userData.level
        this.createdAt = new Date(userData.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }
}

export class Friend {
    constructor(friendData = {}) {
        this._id = friendData._id
        this.name = friendData.name
        this.email = friendData.email
    }
}

export class FriendRequest {
    constructor(friendData = {}) {
        this._id = friendData._id
        this.name = friendData.name
        this.email = friendData.email
        this.status = friendData.status
    }
}