import "./Player.css"

/** Displays a specific player that was added to the game and a remove button
 *
 * Props:
 *  - playerId: The ID of the player
 *  - playerName: The name of the player
 *  - playerColor: The color of the player
 *  - remove(): A callback function for when a 'remove' button is clicked
 *
 * State:
 *  - None
 *
 * PlayerList -> Player */
function Player({ playerId, playerName, playerColor, remove }) {
  // console.log("Player re-rendered");

  const colorCircleStyle = {
    backgroundColor: playerColor
  }

  function removePlayer(evt) {
    remove(playerId);
  }

  return (
    <div className="Player">
      <div className="Player-name">{`${playerName}`}{'  '}</div>
      <div className="Player-colorDiv">
        <div className="Player-colorCircle" style={ colorCircleStyle }></div>
      </div>
      <button className="Player-removeButton" onClick={removePlayer}>Remove</button>
    </div>
  );
}

export default Player;