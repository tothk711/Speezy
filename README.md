# Špeezy — Multiplayer (v1.7)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round already in progress. Up to
4 players (one per color: Sky, Pink, Lime, Violet); extra visitors spectate.

## Files
- `server.js` — Express + Socket.IO server (one always-running game room).
- `game.js` — shared logic: math engine, computer solver, rules, and the
  authoritative `Game` state machine. Also served to the browser for the
  live calculator preview.
- `public/index.html` — the game client.
- `package.json` — dependencies + start script.

## Run locally
```bash
npm install
npm start
```
Then open http://localhost:3000 in a few browser tabs to test.

## Deploy to Railway (from GitHub)
1. Create a new GitHub repo and add **all** these files
   (`server.js`, `game.js`, `package.json`, `.gitignore`, and the `public/`
   folder containing `index.html`). Do **not** commit `node_modules`.
2. In Railway: **New Project → Deploy from GitHub repo →** pick your repo.
3. Railway auto-detects Node, runs `npm install` then `npm start`.
   The server reads the port from the `PORT` env var (set automatically).
4. Open the service → **Settings → Networking → Generate Domain** to get a
   public `https://…up.railway.app` URL.
5. Share that URL with your friends — everyone who opens it joins the same game.

When you push a change to GitHub, Railway redeploys automatically.

## How to play (host instructions)
- Each person who opens the URL is auto-assigned a free color. Click another
  free color circle (top-left) to switch.
- Pick a number, type an equation in the calculator using all three dice,
  press Enter / Check.
- Solve **both** halves of a pair in your color to lock it (3 pts). If a pair
  is split between two colors, either owner can **steal** the other half to
  lock it for themselves (a freshly claimed number is protected for 15s).
- Rounds last 2:00 and gain +20s for every number anyone solves. When a round
  ends, everyone sees the scores and can hover numbers to see solutions; a new
  round starts automatically after ~18s.
- Anyone can press **New Game** (restart now) or **End Round** (end now) —
  there are no host privileges, so coordinate verbally.

## Notes
- No accounts, no lobbies, no anti-cheat — built for a trusted group of friends.
- A single server instance keeps the game in memory, which is perfect for one
  group. (Scaling to multiple instances would need shared state, e.g. Redis.)
