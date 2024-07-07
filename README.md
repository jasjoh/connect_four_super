## Connect Four Super

NOTE: See improved version of this app @ https://github.com/jasjoh/connect_four_tanstack

#### A highly evolved re-write of a vanilla JS bootcamp connect four game exercise.
##### Key Features
- Local Multiplayer Connect Four Games
- Server-Authoritative Game State + Polling Game Updates
- AI (Rudimentary) Players with Fully-Automated Play

##### Stack
- React Front-End
- Node.js / Express.js Back-End
- TypeScript (server)
- PostgreSQL Database

##### Notable Engineering
- 80%+ unit server test coverage (via Jest)
- Factory Functions to support testing

### Local Setup / How To Run / How to Test
- use `npm install` in /client to install client dependencies
- use `npm install` in /server to install server dependencies
- install postgresql (V14.8 or later) and start it
- setup databases using: `psql -f /server/connect-four-init.sql` and accept prompts

## Server Execution
- run the server in dev mode, use `/server/npm run dev`
- run the server in retail, use `/server/npm run live`
- server runs at `http://localhost:3001/`
- to test server, use `/server/jestrun`

## Client Execution
- run the server in dev mode, use `/client/npm run start`
- use `npm run build` to create a build folder for deployment

##### Future Feature Ideas
- add identity and auth
- add online multiplayer
- add high scores / statistics
- add instrumentation / telemetry
- advanced ai algorithms
