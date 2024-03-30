// import "./PlayGame.css";
// import GameBoard from "./GameBoard";

/** Main component that handles playing a specific game
 *
 * Props:
 *  - gameId: The ID of the game instance to play
 *
 * State:
 *  - game: The current game being played
 *
 * GameDetails -> PlayGame -> GameBoard
 * '/games/{gameId} - PlayGame -> GameBoard
 */
function PlayGame({ gameId }) {
  // console.log("PlayGame re-rendered");

  // } else {
  // game has started, show restart + curr player and board
  return (
    <div className="PlayGame">
      {/* <GameBoard boardState={ game.board } dropPiece={ dropPiece }/> */}
    </div>
  );
}

export default PlayGame;