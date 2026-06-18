# Špeezy — Multiplayer (v2.25)

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
Settings → "Auto deploys when pushed to GitHub".) Don't commit `node_modules`.

## What's new in 2.25
- **Factorial bug fixed.** Expressions like `(sqrt(5)*sqrt(5))!/4` now work —
  floating-point dust (e.g. 5.0000000001) is snapped to the nearest integer
  before the factorial whole-number check.
- **"Last 4 rounds"** instead of last 5. A round is now counted **every time
  someone presses New Game** (the board you're leaving is recorded, even an empty
  one), so the tally can be cleared by pressing New Game a few times.
- **Rolled-number keys dim** once the equation has consumed that die, so you can
  see at a glance which dice you've already used.
- **Layered time bonus:** a correct number adds **+5s** (>2:00 left), **+10s**
  (>1:30), **+15s** (>1:00), **+20s** (>0:30), or **+25s** (≤0:30). Less time
  left = more time added.
