var socket = io();

function setUsername(){
    socket.emit('setUsername', roomName, $('#username').val());
}

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