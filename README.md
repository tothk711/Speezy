# Špeezy — Multiplayer (v2.23)

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

## What's new in 2.23 (timing tweaks)
- ❌ **Premature-cross** mutation now triggers at **0:30** (was 0:20).
- 💡 **Last-minute hints** mutation now triggers at **0:20** (was 0:15), and
  re-fires each time the clock passes 0:20.
- The **timer turns red** (and the stats bar starts its urgent pulse) at **0:30**
  (was 0:20), lining up with the premature-cross mutation.
