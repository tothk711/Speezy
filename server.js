// Špeezy multiplayer server — Express + Socket.IO, one always-running game room.
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const { Game } = require('./game.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DIRS = [path.join(__dirname, 'public'), __dirname];
function find(file){
  for (const d of DIRS){ const p = path.join(d, file); if (fs.existsSync(p)) return p; }
  return null;
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  const idx = find('index.html');
  if (idx) return res.sendFile(idx);
  res.status(500).send('index.html not found in the deployment.');
});
app.get('/game.js', (req, res) => {
  const g = find('game.js');
  if (g) return res.sendFile(g);
  res.status(404).send('game.js not found');
});

const game = new Game(
  (g) => io.emit('state', g.serialize()),
  (fx) => io.emit('fx', fx)
);

io.on('connection', (socket) => {
  const color = game.addSocket(socket.id);
  socket.emit('you', color);
  socket.emit('state', game.serialize());
  io.emit('state', game.serialize());

  socket.on('pickColor', (hex) => { const c = game.pickColor(socket.id, hex); socket.emit('you', c); });
  socket.on('setInitials', (t) => game.setInitials(socket.id, t));
  socket.on('setMutation', (m) => game.setMutation(m && m.key, m && m.on));
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
const idx = find('index.html');
server.listen(PORT, () => {
  console.log('Speezy 2.2 running on port ' + PORT);
  console.log('Serving client from: ' + (idx || 'NOT FOUND — check that index.html is in the repo'));
});
