const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    room: {
        type: String
    },
    sender : {
        type: String
    },
    receiver : {
        type : String
    },
    message: {
        type : String
    },
    sentAt : {
        type : Date
    },
    readAt : {
        type : Date
    },
    isReads: {
        type: [String]
    }
})

module.exports = mongoose.model('Chat', chatSchema)