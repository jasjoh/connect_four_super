import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./Main.js";

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
      <Route path="/" element={<Main />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default RoutesList;