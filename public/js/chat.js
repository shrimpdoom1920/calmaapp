//Socket set-up for client 
var socket = io();

//Function for optimize content in the message box
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
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('connect', function(){
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('youre good');
        }

    });
});

socket.on('updateUserList', function(users){
    console.log('users', users);
    var ol = jQuery('<ol></ol>');

    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user))
    });

    jQuery('#users').html(ol);
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
    
});

socket.on('newEmergency', function(emergency){
    var formatTime = moment(emergency.createdAt).format('h:mm a');
    var template = jQuery('#emergency-message-template').html();
    var html = Mustache.render(template, {
        text: emergency.text,
        from: emergency.from,
        createdAt: formatTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
})

socket.on('newLocationChat', function(chat){
    var formatTime = moment(chat.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: chat.url,
        from: chat.from,
        createdAt: formatTime,
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});



jQuery("#message-form").on('submit', function(event){
    event.preventDefault(); 

    var messageTxtBox = jQuery('[name=message]');
    socket.emit('createChat',{
        text: messageTxtBox.val()
    }, function(){
        messageTxtBox.val('');
    });
});


$(document).ready(function(){
    $("input[type='button']").click(function(){
        var radioValue = $("input[name='work']:checked").val();
        if(radioValue){
            console.log(radioValue);
        }
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