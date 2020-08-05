var socket = io();

function setUsername(){
    socket.emit('setUsername', roomName, $('#username').val());
}
var typing = false;
var timeout = undefined;

function timeoutFunction(){
    typing = false;
    socket.emit('someoneNotTyping', roomName);
}

$('#takemsg').keypress(function(e){
    if(e.which != 13){
        if(typing == false){
            typing = true;
            socket.emit('someoneTyping', roomName);
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 4000);
        }else{
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 4000);
        }
    }else{
        getandsendmsg();
    }
});
socket.on('xIsTyping', function(data){
    $('.showMsg').append("<p class='recieveMsg showTyping'>" + data.name + " is typing....</p>");
});
socket.on('xIsNotTyping', function(data){
    $('.showTyping').remove();
});



socket.on('userSet', function(data){
    $('#joinedAs').html("Joined as " + data.username);
    $('.chatSection').css("display" , "block");
    $('.setUsername').css("display" , "none");
    $('.showMsg').append("<p class='recieveMsg'>Hey " + data.username + " welcome to the chat room</p>");
    
});

socket.on('newUserJoined', function(data){
    $('.showMsg').append("<p class='recieveMsg'>" + data + " joined the chat group</p>");
    //$('#showMsg').append($('<p class="recieveMsg">').text(data + ' joined the chat group'));
});
socket.on('UserLeft', function(data){
    $('.showMsg').append("<p class='recieveMsg'>" + data + " left the chat group</p>");
    //$('#showMsg').append($('<p class="recieveMsg">').text(data + ' left the chat group'));
});

function getandsendmsg(){
    socket.emit('chat message', roomName, $('#takemsg').val());
    $('.showMsg').append("<p class='sentMsg'>" + $('#takemsg').val() + "</p>");
    $('#takemsg').val('');
}

socket.on('room-created', room => {
    const roomContainer = document.getElementById('room-container')
    const roomElement = document.createElement('p')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  })

socket.on('newMsg', function(data){
    $('.showTyping').remove();
    $('.showMsg').append("<p class='recieveMsg'>" + data.name + " : " + data.message + "</p>");
});
//socket.on('broadcast', function(data){
//    $('#totalActive').html(data.description);
//    $('#allusers').empty();
//    $.each(data.allUsers, function(key, value){
//        $('#allusers').append($('<li>').text(value));
//    });
    //for(var i=0; i<data.allUsers.length; i++){
    //    $('#allusers').append($('<li>').text(data.allUsers[i][1]));
    //}
//});