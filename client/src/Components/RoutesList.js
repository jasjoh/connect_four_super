import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./Main.js";
import PlayGame from "./PlayGame.js";
import GameList from "./GameList.js";
import PlayerList from "./PlayerList.js";
import GameDetails from "./GameDetails.js";
import PlayerDetails from "./PlayerDetails.js";

/** Handles re-routing of all URLs to main
 *
 * Props:
 *  - none
 *
 * State:
 *  - none
 *
 * App -> RoutesList -> { Main  }  */
function RoutesList() {
  return (
    <Routes>
      <Route path="/games/:gameId/play" element={<GameDetails />} />
      <Route path="/games/:gameId" element={<PlayGame />} />
      <Route path="/games" element={<Main subComponent={GameList}/>} />
      <Route path="/players/:playerId" element={<PlayerDetails />} />
      <Route path="/players" element={<Main subComponent={PlayerList}/>} />
      <Route path="*" element={<Navigate to="/games" />} />
    </Routes>
  );
}

export default RoutesList;