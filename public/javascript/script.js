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

function showTyping(){
    if(typing == false){
        typing = true;
        socket.emit('someoneTyping', roomName);
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 4000);
    }else{
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 4000);
    }
}

$('#takemsg').keypress(function(e){
    if(e.which == 13) getandsendmsg();
});
socket.on('xIsTyping', function(data){
    $('.showMsg').append("<p class='recieveMsg showTyping'>" + data.name + " is typing....</p>");
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
});
socket.on('xIsNotTyping', function(data){
    $('.showTyping').remove();
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
});



socket.on('userSet', function(data){
    $('#joinedAs').html("Joined as " + data.username);
    $('.chatSection').css("display" , "block");
    $('.setUsername').css("display" , "none");
    $('.showMsg').append("<p class='recieveMsg'>Hey " + data.username + " welcome to the chat room</p>");
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
});

socket.on('newUserJoined', function(data){
    $('.showMsg').append("<p class='recieveMsg'>" + data + " joined the chat group</p>");
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
});
socket.on('UserLeft', function(data){
    $('.showMsg').append("<p class='recieveMsg'>" + data + " left the chat group</p>");
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
});

function getandsendmsg(){
    socket.emit('chat message', roomName, $('#takemsg').val());
    $('.showMsg').append("<p class='sentMsg'>" + $('#takemsg').val() + "</p>");
    $('#takemsg').val('');
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
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
    $('.showMsg').stop().animate({ scrollTop: $('.showMsg')[0].scrollHeight}, 1000);
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