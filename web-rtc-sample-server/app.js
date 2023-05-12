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
const port = 2222

connect()

app.use(cors())
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST", "PUT"]
    }
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)
app.use(errorHandler)

io.on('connection', (socket) => {
    // console.log("User connected with socket id : ", socket.id);
    io.emit("updating users", socket.id)
    socket.on('join', (data) => {
        socket.join(data)
    })

    socket.on('chat message', (data) => {
        console.log(data, "SOCKET ID : ", socket.id)
        socket.to(data.room).emit('response', data);
    });

    socket.on('private message', (data) => {
        console.log(data)
        io.to(data.socketId).emit("private message" )
    })

    socket.on("request socketid", (data) => {
        socket.emit('send socketid', socket.id)
    })

    socket.on('save socketid', (data) => {
        console.log(socket.id, data)
    })

    socket.on("disconnect", () => {
        Users.removeSocketId(socket.id)
        io.emit("updating users", "HELLO WORLDS")
        // console.log('user Disconnect with socket id : ' + socket.id)
    })
});

mongoose.connection.once('open', () => {
    server.listen(port, () => {
        console.log("App on port " + port)
    })
})

module.exports = app