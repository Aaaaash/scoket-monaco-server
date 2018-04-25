const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8848);

app.get('/', function (req, res) {
  res.send("Hello World");
});

let roomId;
let friendId;
io.on('connection', function (socket) {
  console.log(`==========> ${socket.id} connected!`);
  roomId = `${socket.id}-room`;

  socket.on('create-room', (userId) => {
    console.log(`==========>${userId} created room ：${roomId}`);
    socket.join(roomId);

    socket.emit('create-room-suc', roomId);
  });

  socket.on('fileUpdate', (params) => {
    io.to(roomId).emit('friend-update', params);
  });

  socket.on('join', (params) => {
    console.log(params.userId, params.roomId);
    friendId = params.userId;
    socket.join(params.roomId);
    io.to(params.roomId).emit('sys-msg', `${params.userId} joined room ${params.roomId}`);
  });
});
