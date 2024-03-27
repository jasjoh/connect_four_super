// import "./PlayGame.css";
import GameBoard from "./GameBoard";

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

  /** Handles user clicks on start / restart button */
  // function handleStartGame() {
  //   // console.log('startGame button clicked');
  //   startGame();
  // }

  // // if there are no players, nothing to do at this point
  // if (game.players.length < 2) { return <div className="PlayGame"></div> }

  // if (game.gameState === 0) {
  //   // game hasn't started, show start button, but no curr player or board
  //   return (
  //     <div className="PlayGame">
  //       <div className="PlayGame-button"><button onClick={handleStartGame}>
  //         Start Game
  //       </button></div>
  //     </div>
  //   );

  // } else {
  // game has started, show restart + curr player and board
  return (
    <div className="PlayGame">
      <div className="PlayGame-button-div">
        <button className="PlayGame-button" onClick={handleStartGame}>
        Restart Game
        </button>
      </div>
      <div className="PlayGame-currentPlayer">
        Current Player: { game.currPlayer.name }
      </div>
      <GameBoard boardState={ game.board } dropPiece={ dropPiece }/>
    </div>
  );
}

export default PlayGame;