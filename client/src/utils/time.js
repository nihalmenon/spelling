const moment = require('moment')

export function formatTime (timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function formatDBDate (date) {
    const formattedDate = moment(date).format("MMM Do YYYY h:mmA")

    return formattedDate
}