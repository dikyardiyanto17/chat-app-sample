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
    Users.currentUserServer(socket.handshake.headers.token, socket.id).then((_) => {
        Users.getUserFromServer().then((data) => {
            io.emit("updating users", data)
        })
    })
    socket.on('join', (data) => {
        socket.join(data)
        io.emit('updating message', "Nothing")
    })

    socket.on('leave', (data) => {
        socket.leave(data)
    })

    socket.on('chat message', (data) => {
        io.to(data.room).emit('response', data);
    });

    socket.on('private message', (data) => {
        io.to(data.socketId).emit("private message")
    })

    socket.on("request socketid", (data) => {
        socket.emit('send socketid', socket.id)
    })

    socket.on("add participant", (data) => {
        io.emit("add participant responses", data)
    })

    socket.on('save socketid', (data) => {
        console.log(socket.id, data)
    })

    // Development Video Call -->

    socket.on("user:call", ({ to, offer }) => {
        console.log(socket.id, to)
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
        io.to(to).to(socket.id).emit("calling", true)
    });

    socket.on("call:rejected", ({to}) => {
        io.to(to).emit("call:rejected", ({isAccepted: false}))
    })

    socket.on("peer:nego:needed", ({ to, offer }) => {
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("cancelCall", ({to}) => {
        io.to(to).to(socket.id).emit("cancelCall", {isCanceling: true})
    })

    socket.on("endCalling", ({to}) => {
        console.log(to, socket.id)
        io.to(to).to(socket.id).emit("endCalling", true)
    })

    // <-- Development Video Call

    socket.on("disconnect", () => {
        Users.removeSocketId(socket.id).then((_) => {
            Users.getUserFromServer().then((data) => {
                io.emit("updating users", data)
            })
        })
    })
});

mongoose.connection.once('open', () => {
    server.listen(port, () => {
        console.log("App on port " + port)
    })
})

module.exports = app