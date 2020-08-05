const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodayParser = require('body-parser')
//var http = require('http').createServer(app)
//var io = require('socket.io')(http)


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodayParser.urlencoded({ extended:true}))

const rooms = {}

app.get('/', (req, res) => {
    res.render('index', { rooms: rooms })
})
  
app.post('/room', (req, res) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }
    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)
    // Send message that new room was created
    io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
      return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room })
})

var server = app.listen(process.env.PORT || 3000)
var io = require('socket.io')(server)


io.on('connection', (socket) => {
    
    socket.on('setUsername', function(room, name){
        socket.join(room)
        rooms[room].users[socket.id] = name
        socket.to(room).broadcast.emit('newUserJoined', name)
        socket.emit('userSet', {username:name})
    })

    socket.on('someoneTyping', (room) => {
        socket.to(room).broadcast.emit('xIsTyping', { name: rooms[room].users[socket.id] })
    })
    socket.on('someoneNotTyping', (room) => {
        socket.to(room).broadcast.emit('xIsNotTyping', { name: rooms[room].users[socket.id] })
    })

    socket.on('chat message', (room, message) => {
        socket.to(room).broadcast.emit('newMsg', { message: message, name: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('UserLeft', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }