const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');


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

    socket.on('newChat', (newChat)=>{
        console.log('created chat', newChat);
    });

    socket.on('disconnect', ()=> {
        console.log('client disconnected');
    });
});


server.listen(port, ()=> {
    console.log(`Server is running ${port}`);
})