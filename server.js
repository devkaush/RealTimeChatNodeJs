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

var clients = 0
users = []
io.on('connection', (socket) => {
    clients++
    //console.log('a user connected')
    io.sockets.emit('broadcast',{ description: clients + ' friends connected!'})

    socket.on('setUsername', function(data){
        if(users.indexOf(data) < 0){
            users.push(data)
            socket.emit('userSet', {username:data})
        }else{
            socket.emit('userExit', data + ' username is taken! Try some other username.')
        }
    })

    socket.on('chat message', (data) => {
        io.emit('newMsg', data)
    })
    socket.on('disconnect', () => {
        //console.log('user disconnected')
        clients--
        io.sockets.emit('broadcast',{ description: clients + ' friends connected!'});
    })
})