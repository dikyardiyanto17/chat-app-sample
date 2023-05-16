const Room = require("../schema/Room");
const User = require("../schema/User");

class Rooms {
    static async getRoom(req, res, next) {
        try {
            const { userId } = req.user
            const userData = await User.findById(userId)
            const roomData = await Room.find({ participants: { $in: [userData.name] } });
            return res.status(200).json(roomData)
        } catch (error) {
            next(error)
        }
    }

    static async createRoomChat(req, res, next) {
        try {
            const { roomName, creator } = req.body
            if (!roomName) {
                throw { name: "Bad Request", message: "Room Name cannot be empty" }
            }
            await Room.create({ name: roomName, participants: [creator] })
            return res.status(201).json({ message: "Success creating room" })
        } catch (error) {
            next(error)
        }
    }

    static async joinRoomChat(req, res, next) {
        try {
            const { roomName, newParticipant } = req.body
            const data = await Room.findOne({ name: roomName })
            if (!roomName) {
                throw { name: "Bad Request", message: "Room Name cannot be empty" }
            }
            if (!newParticipant) {
                throw { name: "Bad Request", message: "Participant is empty" }
            }
            if (!data) {
                throw { name: "Not Found", message: "Room is not found" }
            }
            if (Array.isArray(newParticipant)) {
                data.participants.push(...newParticipant)
            } else if (typeof newParticipant == "string") {
                data.participants.push(newParticipant)
            }
            await Room.findOneAndUpdate({ name: roomName }, { participants: data.participants })
            return res.status(200).json({ message: "Success adding participants" })
        } catch (error) {
            next(error)
        }
    }

    static async leaveRoomChat(req, res, next) {
        try {
            const { roomName, removeParticipant } = req.body
            if (!roomName) {
                throw { name: "Bad Request", message: "Room Name cannot be empty" }
            }
            if (!removeParticipant) {
                throw { name: "Bad Request", message: "There is no participant that want to leave" }
            }
            const data = await Room.findOne({ name: roomName })
            const isExist = (array, value) => {
                return array.some(participant => participant == value)
            }
            if (!isExist(data.participants, removeParticipant)) {
                throw { name: "Not Found", message: "Participant is not found in group chat" }
            }
            const newData = data.participants.filter((value) => value !== removeParticipant);
            await Room.findOneAndUpdate({ name: roomName }, { participants: newData })
            return res.status(200).json({ message: "Success leaving" })
        } catch (error) {
            next(error)
        }
    }

    static async deleteRoomChat(req, res, next) {
        try {
            const { roomName } = req.body
            if (!roomName) {
                throw { name: "Bad Request", message: "Room Name cannot be empty" }
            }
            const data = await Room.findOne({ name: roomName })
            if (!data) {
                throw { name: "Not Found", message: "Chat room is not found" }
            }
            await Room.findOneAndDelete({ name: roomName })
            res.status(200).json({ message: "Success deleting room" })
        } catch (error) {
            next(error)
        }
    }

    static async findRoom(req, res, next) {
        try {
            const { room } = req.params
            const roomData = await Room.findById(room)
            res.status(200).json(roomData)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { Rooms };