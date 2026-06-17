# Špeezy — Multiplayer (v2.1)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round in progress. Up to 6 players
(one per color: Sky, Pink, Lime, Violet, Amber, Teal); extra visitors spectate.

## Files
- `server.js` — Express + Socket.IO server (one always-running game room).
- `game.js` — shared logic: math engine, computer solver, rules, and the
  authoritative `Game` state machine. Also served to the browser.
- `public/index.html` — the game client.
- `package.json` — dependencies + start script.

The server finds `index.html` whether it sits in `public/` or at the repo root,
so a flat upload works too.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000 in a few tabs to test.

## Deploy to Railway (from GitHub)
1. Put these files in a GitHub repo (a flat layout at the root is fine — keep
   `index.html`, `game.js`, `server.js`, `package.json`). Don't commit `node_modules`.
2. Railway → New Project → Deploy from GitHub repo → pick it. It runs
   `npm install` then `npm start` and reads `PORT` automatically.
3. Service → Settings → Networking → Generate Domain for a public URL. Share it.

## What's new in 2.1
- Your typed equation now stays in the calculator until you delete it or claim with it.
- Factorial button is labelled `!`; the target shows `✕` when nothing is picked.
- A taken cell is highlighted for everyone for 5 seconds.
- Sounds: gentle chime for your point, a soft note when an opponent takes a tile,
  and a distinct sound when someone steals (locks) a pair. The final-8-seconds
  ticking is shorter than before.
- The `l` log-shorthand is shown as `log` in the end-of-round recaps.
- Pressing New Game clears any stuck hover tooltips for everyone.

## Notes
No accounts, no lobbies, no anti-cheat — built for a trusted group of friends.
A single server instance keeps the game in memory (perfect for one group).
