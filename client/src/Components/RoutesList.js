import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./Main.js";
import PlayGame from "./PlayGame.js";
import GameList from "./GameList.js";
import PlayerListAndCreate from "./PlayerListAndCreate.js";
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
      <Route path="/games/:gameId/play" element={<PlayGame />} />
      <Route path="/games/:gameId" element={<GameDetails />} />
      <Route path="/games" element={<Main subComponent={GameList}/>} />
      <Route path="/players/:playerId" element={<PlayerDetails />} />
      <Route path="/players" element={<Main subComponent={PlayerListAndCreate}/>} />
      <Route path="*" element={<Navigate to="/games" />} />
    </Routes>
  );
}

export default RoutesList;