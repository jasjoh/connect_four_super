import "./NavBar.css";
import { Link } from "react-router-dom";

/** Navigation bar with links to view list of games or players
 *
 * Props:
 *  - None
 *
 * State:
 *  - None
 *
 * Main -> NavBar
 */
function NavBar() {
  // console.log("NavBar re-rendered");


  return (
    <div className="NavBar">
      <span className="NavBar-link">
        <Link to='/games'>GAME LIST</Link>
      </span>
      {/* <span className="NavBar-spacer">&nbsp;|&nbsp;</span> */}
      <span className="NavBar-link">
        <Link to='/players'>PLAYER LIST</Link>
      </span>
    </div>
  );
}

export default NavBar;