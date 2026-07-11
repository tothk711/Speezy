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

// Find a file whether it lives in ./public or right next to server.js (flat repos work).
const DIRS = [path.join(__dirname, 'public'), __dirname];
function find(file){
  for (const d of DIRS){ const p = path.join(d, file); if (fs.existsSync(p)) return p; }
  return null;
}

// Serve index.html and game.js with no-store so a fresh deploy shows up on a plain refresh
// (stale browser caches were a recurring "my change isn't live" headache).
const staticOpts = {
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('game.js')) res.set('Cache-Control', 'no-store');
  }
};
app.use(express.static(__dirname, staticOpts));
app.use(express.static(path.join(__dirname, 'public'), staticOpts));

app.get('/', (req, res) => {
  const idx = find('index.html');
  if (idx) { res.set('Cache-Control', 'no-store'); return res.sendFile(idx); }
  res.status(500).send('index.html not found in the deployment.');
});
app.get('/game.js', (req, res) => {
  const g = find('game.js');
  if (g) { res.set('Cache-Control', 'no-store'); return res.sendFile(g); }
  res.status(404).send('game.js not found');
});

const game = new Game(
  (g) => io.emit('state', g.serialize()),
  (fx) => io.emit('fx', fx),
  (g) => io.emit('tick', { t: Math.max(0, g.timeLeft) })  // light 1/s heartbeat instead of full state
);

io.on('connection', (socket) => {
  const cid = (socket.handshake.auth && socket.handshake.auth.cid)
           || (socket.handshake.query && socket.handshake.query.cid)
           || socket.id;
  try {
    const color = game.join(socket.id, cid);
    socket.emit('you', color);
    socket.emit('state', game.serialize());
  } catch (e) { console.error('connection error', e); }

  socket.on('pickColor', (hex) => { try { socket.emit('you', game.pickColor(cid, hex)); } catch (e) { console.error('pickColor', e); } });
  socket.on('setInitials', (m) => { try { game.setInitials(m && m.hex, m && m.text); } catch (e) { console.error('setInitials', e); } });
  socket.on('setMutation', (m) => { try { game.setMutation(m && m.key, m && m.on); } catch (e) { console.error('setMutation', e); } });
  socket.on('claim', (msg) => {
    try {
      const r = game.claim(game.colorFor(cid), msg && msg.pi, msg && msg.ti, msg && msg.eq);
      socket.emit('claimResult', r);
    } catch (e) { console.error('claim', e); socket.emit('claimResult', { ok:false, message:'\u26a0 Server error \u2014 try again.' }); }
  });
  socket.on('newGame', () => { try { game.forceNew(); } catch (e) { console.error('newGame', e); } });
  socket.on('endRound', () => { try { game.forceEnd(); } catch (e) { console.error('endRound', e); } });
  socket.on('sync', () => { try { socket.emit('state', game.serialize()); } catch (e) { console.error('sync', e); } });
  socket.on('disconnect', () => { try { game.leaveSocket(socket.id); } catch (e) { console.error('disconnect', e); } });
});

const PORT = process.env.PORT || 3000;
const idx = find('index.html');
server.listen(PORT, () => {
  console.log('Speezy 4.5 running on port ' + PORT);
  console.log('Serving client from: ' + (idx || 'NOT FOUND — check that index.html is in the repo'));
});
