const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodayParser = require('body-parser')
//var http = require('http').createServer(app);
//var io = require('socket.io')(http);

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

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    });
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})