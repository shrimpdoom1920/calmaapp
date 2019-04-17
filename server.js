const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 5000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket)=>{
    console.log('new user is connected');

    // socket.emit('newChat', {
    //     from: 'Nathan',
    //     text: 'Hi, i need to get my steam account back',
    //     createAt: 'feb 2014'
    // });

    socket.emit('newChat', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newChat', generateMessage('Admin', 'New user is joined'));

    socket.on('createChat', (chat, callback)=>{
        console.log('created chat', chat);
        io.emit('newChat', generateMessage(chat.from, chat.text));
        callback('This is from the server')
        // socket.broadcast.emit('newChat', {
        //     from: chat.from,
        //     text: chat.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', ()=> {
        console.log('client disconnected');
    });
});


server.listen(port, ()=> {
    console.log(`Server is running ${port}`);
})