import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./Main.js";
import PlayGame from "./PlayGame.js";

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
      <Route path="/games/:gameId" element={<PlayGame />} />
      <Route path="/games" element={<Main />} />
      <Route path="/players" element={<Main />} />
      <Route path="*" element={<Navigate to="/games" />} />
    </Routes>
  );
}

export default RoutesList;