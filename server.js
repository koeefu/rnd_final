var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('running');

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);
    // console.log(socket);

    socket.on('button', handleButton);
    socket.on('volume', volumeSlider);

    function volumeSlider(value) {
      socket.broadcast.emit('volume', value);
    }

    function handleButton(value){
      console.log('button control');
      socket.broadcast.emit('button', value);
    }
}





