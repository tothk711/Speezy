# Špeezy — Multiplayer (v2.61)

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

## What's new in 2.61 (mobile layout fixes)
- **Fixed the calculator overlapping the board.** The phone layout now stacks in a
  real single column and the calculator no longer keeps its desktop "sticky"
  position, so board numbers can't hide behind it.
- **Dice emoji are back** next to the rolled numbers on mobile (just smaller).

## What's new in 2.6
- **Third mutator: 💰 Bounty.** A new toggle alongside ❌ and 💡. When on, each
  new round the server marks one pair — chosen so **both halves are solvable** —
  as the gold bounty:
  - Each bounty tile is worth **2** points; **locking the whole pair pays 5**
    (a split bounty pair is 2 each).
  - The pair gets a pulsing **gold ring + 💰 badge**, and a bouncy **"💰 Bounty!"**
    bubble points at it on round start, with a gentle gold chime (and a celebratory
    chime when someone locks it).
  - Like the other mutators it's shared, off by default, and applies next round.
