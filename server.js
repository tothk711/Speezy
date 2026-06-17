// Špeezy multiplayer server — Express + Socket.IO, one always-running game room.
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { Game } = require('./game.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// static client
app.use(express.static(path.join(__dirname, 'public')));
// shared game module (used by the browser for the live preview)
app.get('/game.js', (req, res) => res.sendFile(path.join(__dirname, 'game.js')));

// one perpetual game; broadcast on every change + every tick
const game = new Game(
  (g) => io.emit('state', g.serialize()),
  (fx) => io.emit('fx', fx)
);

io.on('connection', (socket) => {
  const color = game.addSocket(socket.id);     // auto-assign a free color
  socket.emit('you', color);                   // tell this client its color (may be null = spectator)
  socket.emit('state', game.serialize());      // immediate snapshot
  io.emit('state', game.serialize());          // refresh everyone's player list

  socket.on('pickColor', (hex) => {
    const c = game.pickColor(socket.id, hex);
    socket.emit('you', c);
  });

  socket.on('claim', (msg) => {
    const color = game.sockets[socket.id];
    const r = game.claim(color, msg && msg.pi, msg && msg.ti, msg && msg.eq);
    socket.emit('claimResult', r);
  });

  socket.on('newGame', () => game.forceNew());
  socket.on('endRound', () => game.forceEnd());

  socket.on('disconnect', () => game.removeSocket(socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Speezy multiplayer running on port ' + PORT));
