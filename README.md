# Špeezy — Multiplayer (v2.22)

A real-time multiplayer math dice game. One shared game runs forever on the
server; anyone who opens the URL joins the round in progress. Up to 6 players.

Flat layout — `index.html`, `game.js`, `server.js` and `package.json` all sit at
the top level (no `public/` folder). Drop them into your repo and push.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000 in a few tabs.

## Deploy to Railway (GitHub)
Push these files to your repo root. Railway runs `npm install` then `npm start`
and reads `PORT` automatically. (Make sure auto-deploy is enabled in
Settings → "Auto deploys when pushed to GitHub".)

## What's new in 2.22
- **Bigger, clearer calculator buttons** — the sign/number keys use a larger,
  bolder font and taller (more square) padding so they're easier to read and tap.
- **New mutation: 💡 last-minute hints** (toggle to the right of the ❌ mutation).
  When enabled, every time the clock hits **0:15** a partial hint pops up on a
  random unsolved tile, showing the **first 4 characters** of the computer's
  solution. It fades after 10 seconds and re-triggers each time the timer passes
  0:15 (handy when the +30s bonus pushes the clock back up). Applies next round.

Both mutations are off by default, are shared for the whole table, and take
effect on the next board.
