## Connect Four Super
#### A highly evolved re-write of a vanilla JS bootcamp connect four game exercise.
##### Features
- [P0] Multiplayer Connect Four Games
- [P0] Server-Authoritative Game State
- [P0] AI Players with fully-automated play
- [P1] High Scores
- [P1] Authenticated Users / Gameplay
- [P1] Advanced AI Play
##### Stack
- TypeScript
- React Front-End
- Node.js / Express.js Back-End
- PostgreSQL Database
##### Notable Engineering
- 80%+ unit test coverage (via Jest)
- Factory Functions to support testing

### Setup / How To Run / How to Test
- run `npm install` in /client to install client dependencies
- run `npm install` in /server to install server dependencies
- install postgresql (V14.8 or later)
- setup databases: `psql -f /server/connect-four-init.sql` and accept prompts
- run the server in dev mode (`node srv/server/ts`) or retail (`npx tsc` to build then `node dist/server.js` to run server)
- server runs at `http://localhost:3000/`
- to test client, from `/client` run `npm test`
- to test server, from `/server` run `jest`

