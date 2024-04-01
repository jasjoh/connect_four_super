import "./Main.css";
import NavBar from "./NavBar";

/** Parent level component for displaying nav bar and all other components
 *
 * Props:
 *  - component: the subcomponent (GameList / PlayerList) to render
 *
 * State:
 *  - None
 *
 * RoutesList -> Main -> { NavBard, GameList, PlayerList } */
function Main({ subComponent: SubComponent }) {
  // console.log("Main re-rendered");

   return (
    <div className="Main">
      <NavBar />
      <SubComponent />
    </div>
  );
}

export default Main;