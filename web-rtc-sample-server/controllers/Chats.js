const Chat = require("../schema/Chat");
const Room = require("../schema/Room");
const User = require("../schema/User");

class Chats {
    static async findChat(req, res, next) {
        try {
            const { id } = req.params
            const { userId } = req.user
            const userReceiverData = await User.findById(id)
            const userSenderData = await User.findById(userId)
            if (userReceiverData) {
                const chatData = await Chat.find().or([{ receiver: userSenderData.name, sender: userReceiverData.name }, { sender: userSenderData.name, receiver: userReceiverData.name }])
                res.status(200).json(chatData)
            } else {
                const groupChatData = await Room.findById(id)
                const chatData = await Chat.find({ room: groupChatData.name })
                res.status(200).json(chatData)
            }
        } catch (error) {
            next(error)
        }
    }

    static async sendChat(req, res, next) {
        try {
            const { roomName, message, sender, receiver } = req.body
            if (!message) {
                throw { name: "Bad Request", message: "Message cannot be empty" }
            }
            if (!sender) {
                throw { name: "Bad Request", message: "Sender is empty" }
            }
            const roomData = await Room.findOne({ name: roomName })
            const isExist = (array, value) => {
                return array.some(participant => participant == value)
            }
            if (roomName) {
                if (!isExist(roomData?.participants, sender)) {
                    throw { name: "Not Found", message: "Participant is not found in group chat" }
                }
                const data = await Room.findOne({ name: roomName })
                if (!data) {
                    throw { name: "Not Found", message: "Room is not exist" }
                }
                await Chat.create({ room: roomName, sender, message, sentAt: new Date() })
                return res.status(201).json({ message })
            } else if (message && sender && receiver) {
                await Chat.create({ message, sender, receiver, sentAt: new Date() })
                return res.status(201).json({ message })
            } else {
                throw { name: "Bad Request", message: "Request is not valid" }
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { Chats };