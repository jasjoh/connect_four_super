// import "./PlayerList.css"
import Player from "./Player.js"

/** Displays the list of players added to the game
 *
 * Props:
 *  - players: An array of player objects { name, color, id, ai }
 *  - remove(): A callback function for when a 'remove' button is clicked
 *
 * State:
 *  - None
 *
 * PlayerManager -> PlayerList -> Player */
function PlayerList({ players, remove }) {
  // console.log("PlayerList re-rendered");

  return (
    <div className="PlayerList">
      {players.map( (p, index) => <Player
        key={index}
        playerId={p.id}
        playerName={p.name}
        playerColor={p.color}
        remove={remove}/>)}
    </div>
  );
}

export default PlayerList;