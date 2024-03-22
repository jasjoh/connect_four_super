import "./PlayerManager.css"
import PlayerList from "./PlayerList.js"
import AddPlayerForm from "./AddPlayerForm.js"

/** Displays the list of players added to the game
 *
 * Props:
 *  - players: An array of player objects { name, color, id, ai }
 *  - add(): A callback function for when a player is added
 *  - remove(): A callback function for when a 'remove' button is clicked
 *
 * State:
 *  - None
 *
 * Main -> PlayerManager -> PlayerList */
function PlayerManager({ players, add, remove }) {
  // console.log("PlayerManager re-rendered");

  return (
    <div className="PlayerManager">
      <div className="PlayerListTitle">Current Players (Minimum Two)</div>
      <PlayerList players={players} remove={remove} />
      <div className="AddPlayerFormTitle">Add Player</div>
      <AddPlayerForm add={add} />
    </div>
  );
}

export default PlayerManager;