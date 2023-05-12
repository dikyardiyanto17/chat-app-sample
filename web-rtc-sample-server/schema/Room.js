const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const participantSchema = new Schema ({
//     name: String
// })

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    participants: {
        type : [String]
    }
})



module.exports = mongoose.model('Room', roomSchema)