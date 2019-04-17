var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');

    // socket.emit('newChat', {
    //     from: 'Nathan',
    //     text: 'Hi, i need to get my steam account back'
    // });
});

socket.on('newChat', function(chat){
    console.log('new chat', chat)
    var li = jQuery('<li></li>');
    li.text(`${chat.from}: ${chat.text}`);

    jQuery('#messages').append(li);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

// socket.emit('createChat', {
//     from: 'Nathan',
//     text: 'I\'ve\ retrieved back my steam account this morning'
// }, function(data){
//     console.log('Got it', data);
// });

jQuery("#message-form").on('submit', function(event){
    event.preventDefault(); 

    socket.emit('createChat',{
        from: 'Nathan',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});