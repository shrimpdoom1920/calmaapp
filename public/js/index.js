var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');

    socket.emit('newChat', {
        from: 'Nathan',
        text: 'Hi, i need to get my steam account back'
    });
});

socket.on('newChat', function(chat){
    console.log('new chat', chat)
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});