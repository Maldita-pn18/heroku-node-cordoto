var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var onlineUsers = [];
var count= 0; //message count

/* routing */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// app.get('/logIn', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
/*routing ends */

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('online', function(onl){
    if(!onlineUsers.includes(onl)){
      onlineUsers.push(onl);
    }
    io.emit('friends', onlineUsers);
  });

  socket.on('chat message', function(msg){
    msg["count"] = ++count;
    io.emit('chat message', msg); //send to all client including sender
    // socket.broadcast.emit('chat message', msg);
  });

  socket.on('typing', function(status){
    socket.broadcast.emit('typing status', status);
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
