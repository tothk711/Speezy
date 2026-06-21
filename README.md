# Špeezy — Multiplayer (v2.5)

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

## What's new in 2.5
- **Mobile layout.** A **"Mobile layout"** button (top-right) switches the whole
  board to a compact one-column phone layout. It auto-enables on phones and your
  choice is remembered; tap again for the desktop layout.
  - Much smaller buttons, dice and tiles so far more fits on screen (the board is
    a tight 3-column grid).
  - Color picker and last-4-round points move to the **bottom**.
  - Tapping the calculator **no longer opens the phone keyboard** — the on-screen
    calc has every symbol (the field is read-only with `inputmode="none"`).
  - Round-end solutions reveal on **tap** (phones can't hover); tap empty space to
    dismiss. Snappier taps (no double-tap-zoom delay) and the decorative dice
    emoji are hidden to save room.
- Only `index.html` changed for the layout; `game.js` is unchanged and `server.js`
  only updates its startup log string.
