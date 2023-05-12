const express = require('express')
const { Users } = require('../controllers/Users')
const authentication = require('../middlewares/authentication')
const { Chats } = require('../controllers/Chats')
const { Rooms } = require('../controllers/Rooms')
const router = express.Router()

router.post('/register', Users.register)
router.post('/login', Users.login)
router.use(authentication)
router.get('/finduser/:id', Users.findUser)
router.get('/currentuser', Users.currentUser)
router.get('/users', Users.fetchAllUser)
router.put('/users', Users.updateSocketId)
router.post('/room', Rooms.createRoomChat)
router.put('/room', Rooms.joinRoomChat)
router.delete('/room', Rooms.deleteRoomChat)
router.put('/leave', Rooms.leaveRoomChat)
router.get('/chat/:id', Chats.findChat)
router.post('/chat', Chats.sendChat)

module.exports = router