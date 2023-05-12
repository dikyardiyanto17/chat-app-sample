const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    },
    status : {
        type: Boolean
    }
})

module.exports = mongoose.model('User', userSchema)