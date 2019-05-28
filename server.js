const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage, generateEmergency } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { User } = require('./utils/user');
const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 5000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new User();

const User1 = require('./models/User');

mongoose.connect('mongodb://nathan:nathan1@ds151066.mlab.com:51066/calma-app', { useNewUrlParser: true})
        .then(console.log('MongoDB is connected'))
        .catch((err)=> console.log(err));

app.use(express.static(publicPath));

//Middleware BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/audit', (req, res)=> { res.send('hello')});

io.on('connection', (socket)=>{
    console.log('new user is connected');

    // socket.emit('newChat', {
    //     from: 'Nathan',
    //     text: 'Hi, i need to get my steam account back',
    //     createAt: 'feb 2014'
    // });

    // socket.broadcast.emit('newChat', generateMessage('Admin', 'New user is joined'));
    
    socket.on('join',(params, callback)=> {
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and Room name are required');
        }

        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room)); 
        socket.emit('newEmergency', generateEmergency('Kristine Mariano', 'EMERGENCY. We are triggering a site call emergenciy due an earthquake that has hit McKinley Hill'));
        socket.broadcast.to(params.room).emit('newChat', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createChat', (chat, callback)=>{
        console.log('created chat', chat);
        var user = users.getUser(socket.id);
        if(user && isRealString(chat.text)){
            io.to(user.room).emit('newChat', generateMessage(user.name, chat.text));
        }

        callback('');
        // callback('This is from the server');
        // socket.broadcast.emit('newChat', {
        //     from: chat.from,
        //     text: chat.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        console.log(coords);
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationChat', generateLocationMessage(user.name, coords.latitude, coords.longitude ));
    });
    

    socket.on('disconnect', ()=> {
        console.log('client disconnected');

        var user = users.removeUser(socket.id);

        io.to(user.room).emit('updateUserList', users.getUserList(user.room));;
        io.to(user.room).emit('newChat', generateMessage('Admin', `${user.name} has left.`));
    });
});


server.listen(port, ()=> {
    console.log(`Server is running ${port}`);
})