const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { generateMsg } = require("./utils/messages")
const { generateLocationMsg } = require("./utils/messages")
const { addUser, getUser, removeUser, getUsersInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')

const io = socketio(server);

app.use(express.static(publicDir))

/*socket.emit => send msg to particular client
io.emit  =>  send msg to all connected client
socket.broadcast.emit => send msg to all clients except the one
*/

io.on('connection', (socket) => {
    console.log("New Web Socket Connection")
    socket.on('join', ({ username, room }, callback) => {
        const {error,user} = addUser({id:socket.id, username, room})

        //send ack error to user if exists
        if(error){
            return callback(error)
        }

        socket.join(user.room)//can only be used on server  and is used to join room for that user  
        socket.emit('message', generateMsg("Server",`Welcome ${user.username}`))
        socket.broadcast.to(user.room).emit('message', generateMsg("Server",`${user.username} has joined the room`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })



    socket.on('sendMessage', (msg, callback) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('message', generateMsg(user.username,msg))
        callback("From Server")
    })

    socket.on('disconnect', () => {
        const user=removeUser(socket.id) //socket.id is global
        if(user){ //if user exists
            io.to(user.room).emit('message', generateMsg("Server",`${user.username} has left the chat!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }        
    })

    socket.on('sendLocation', (coords, callback) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMsg', generateLocationMsg(user.username,coords))
        callback()
    })
})


server.listen(port, () => {
    console.log(`Chat-App Server started on ${port}!`)
})

