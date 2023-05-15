const cors = require('cors')
require('dotenv').config()
const connect = require('./config/mongodb')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandlers');
const { Users } = require('./controllers/Users')
// const User = require("./schema/User");
const port = 2222

connect()

app.use(cors())
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST", "PUT"]
    },
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)
app.use(errorHandler)
io.on('connection', (socket) => {
    // const userDataServer = await User.find().select("socketId name status")
    Users.currentUserServer(socket.handshake.headers.token, socket.id)
    Users.getUserFromServer().then((data) => {
        io.emit("updating users", data)
    })
    // io.emit("update status", "online")
    socket.on('join', (data) => {
        socket.join(data)
    })

    socket.on('chat message', (data) => {
        console.log(data, "SOCKET ID : ", socket.id)
        socket.to(data.room).emit('response', data);
    });

    socket.on('private message', (data) => {
        io.to(data.socketId).emit("private message")
    })

    socket.on("request socketid", (data) => {
        socket.emit('send socketid', socket.id)
    })

    socket.on('save socketid', (data) => {
        console.log(socket.id, data)
    })

    socket.on("disconnect", () => {
        Users.removeSocketId(socket.id).then((_) => {
            Users.getUserFromServer().then((data) => {
                io.emit("updating users", data)
            })
        })
        // io.emit('update status', "offline")
        // console.log('user Disconnect with socket id : ' + socket.id)
    })
});

mongoose.connection.once('open', () => {
    server.listen(port, () => {
        console.log("App on port " + port)
    })
})

module.exports = app