const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodayParser = require('body-parser')
//var http = require('http').createServer(app)
//var io = require('socket.io')(http)

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodayParser.urlencoded({ limit:'10mb', extended:false}))

app.use('/', indexRouter)

var server = app.listen(process.env.PORT || 3000)
var io = require('socket.io')(server)

var clients
const users = {}
allusers = []
io.on('connection', (socket) => {
    //clients++
    //console.log('a user connected')
    //io.sockets.emit('broadcast',{ description: clients + ' of your friends are connected yet!'})

    socket.on('setUsername', function(data){
        if(allusers.indexOf(data) < 0){
            allusers.push(data)
            //clients++
            users[socket.id] = data
            clients = io.engine.clientsCount
            io.sockets.emit('broadcast',{ description: clients + ' of your friends are connected yet!', allUsers: users})
            socket.emit('userSet', {username:data})
        }else{
            socket.emit('userExit', data + ' username is taken! Try some other username.')
        }
    })

    socket.on('chat message', (data) => {
        socket.broadcast.emit('newMsg', data)
    })
    socket.on('disconnect', () => {
        //console.log('user disconnected')
        //clients--
        clients = io.engine.clientsCount
        delete users[socket.id]
        io.sockets.emit('broadcast',{ description: clients + ' of your friends are connected yet!', allUsers: users});
    })
})