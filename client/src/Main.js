import GameComponent from "./GameComponent";
import PlayerManager from "./PlayerManager";
import { Player, AiPlayer, Game } from "./models";
import { useEffect, useState } from "react";

/** Parent level page for both the alert, player manager and game area
 *
 * Props:
 *  - None
 *
 * State:
 *  - game: The instance of the game once initialized
 *  - renderToggle: Used to trigger a re-render when game state is updated
 *
 * RoutesList -> Main -> { Alert, PlayerManager, Game } */
function Main() {
  // console.log("Main re-rendered");

  /** TODO:
  * - add typescript
   */

  const [game, setGame] = useState(new Game(aiCallback));
  const [renderToggle, setRenderToggle] = useState(false);
  let alert = '';

  /** Called once on mount to initialize a new game and set state */
  // useEffect(function initGame() {
  //   // console.log("initGame() useEffect called")
  //   setGame(new Game(aiCallback));
  // }, [])

  // console.log("Current game instance:", game);

  /** Called by the game instance when an AI player has taken their turn
   * Needs to trigger a re-render of Game component */
  function aiCallback() {
    // console.log("aiCallback() called")
    setRenderToggle(renderToggle => !renderToggle);
  }

  /** Called when a user drops a piece */
  function dropPiece(colIndex) {
    // console.log("dropPiece() called with colIndex:", colIndex);
    game.dropPiece(colIndex);
    setRenderToggle(renderToggle => !renderToggle);
  }

  /**
   * Called when a user adds a player to a game
   * formData = { playerName, color, ai }
   * */
  function addPlayer(formData) {
    // console.log("addPlayer called with playerData:", formData);
    if (formData.ai === true) {
      game.addPlayer(new AiPlayer(formData.playerName, formData.color))
    } else {
      game.addPlayer(new Player(formData.playerName, formData.color))
    }
    // console.log("player added to game:", game);
    setRenderToggle(renderToggle => !renderToggle);
  }

  /** Called when a user removes a player from a game */
  function removePlayer(playerId) {
    // console.log("removePlayer called with playerId:", playerId);
    game.removePlayer(playerId);
    setRenderToggle(renderToggle => !renderToggle);
  }

  /** Called when a user clicks Start or Restart button */
  async function startGame() {
    // console.log("function startGame() called");
    await game.startGame();
    setRenderToggle(renderToggle => !renderToggle);
  }

  // if (game === undefined) { return <div> Game loading </div>}`

  // handle winning game
  if (game.gameState === 2) {
    // highlight winning pieces
    for (let coord of game.winningSet) {
      game.board[coord[0]][coord[1]].highlight = true;
    }
    alert = `${game.currPlayer.name} has won the game!`;
  }

  // handle tie
  if (game.gameState === 3) {
    alert = `Game is tied!`;
  }

  return (
    <div className="Main">
      <PlayerManager players={game.players} add={addPlayer} remove={removePlayer} />
      <div className="Main-alert">{ alert }</div>
      <GameComponent
        game={game}
        dropPiece={dropPiece}
        startGame={startGame} />
    </div>
  );
}

export default Main;