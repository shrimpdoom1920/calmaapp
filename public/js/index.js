var socket = io();

function scrollToBottom (){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + scrollHeight + newMessageHeight + lastMessageHeight >= clientHeight){
        messages.scrollTop(scrollHeight);
    }

}

socket.on('connect', function(){
    console.log('Connected to server');

    // socket.emit('newChat', {
    //     from: 'Nathan',
    //     text: 'Hi, i need to get my steam account back'
    // });
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newChat', function(chat){
    console.log('newChat', chat);

    var formatTime = moment(chat.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
       text: chat.text,
       from: chat.from,
       createdAt: formatTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    // var formatTime = moment(chat.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // li.text(`${chat.from}: ${formatTime} ${chat.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationChat', function(chat){
    var formatTime = moment(chat.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: chat.url,
        from: chat.from,
        createdAt: formatTime,
    });

    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location </a>');

    // li.text(`${chat.from} ${formatTime}: `);
    // a.attr('href', chat.url);
    // li.append(a);

    jQuery('#messages').append(html);
    scrollToBottom();
});

// socket.emit('createChat', {
//     from: 'Nathan',
//     text: 'I\'ve\ retrieved back my steam account this morning'
// }, function(data){
//     console.log('Got it', data);
// });

jQuery("#message-form").on('submit', function(event){
    event.preventDefault(); 

    var messageTxtBox = jQuery('[name=message]');
    socket.emit('createChat',{
        from: 'User',
        text: messageTxtBox.val()
    }, function(){
        messageTxtBox.val('');
    });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled');
        alert('Unable to fecth location');
    });
});