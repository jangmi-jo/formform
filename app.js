const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const crypto = require('crypto');
const GameState = require('./public/lib/game_state.js');
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const allRooms = new Map();

io.on('connection', (socket) => {
  socket.on('newRoom', () => {
    let roomId = crypto.randomBytes(5).toString('hex');
    while (allRooms.get(roomId)) {
      roomId = crypto.randomBytes(5).toString('hex');
    }
    let newGameState = new GameState(io, socket, roomId, allRooms);
    allRooms.set(roomId, newGameState);
    socket.emit('setLink', roomId);
  });

  socket.on('joinRoom', (roomId) => {
    let gameState = allRooms.get(roomId);
    if (gameState === undefined) {
      socket.emit('failure', "Can't find the room. Please check the room ID.");
    } else {
      if (gameState.sockets.size < 2) {
        gameState.addSocket(socket);
        socket.emit('setLink', roomId);
        io.to(roomId).emit('matchSuccess');
      } else {
        socket.emit('failure', "The room is currently full.");
      }
    }
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
