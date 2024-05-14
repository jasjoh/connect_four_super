import { GameManager } from "../gameManager.js";
import { gameStates } from "../utils.js";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PlayerList from "./PlayerList.js";
import GameBoard from "./GameBoardComponents/GameBoard.js";


// import "./PlayGame.css";
/** Main component that handles playing a specific game
 *
 * Props:
 *  - gameId: The ID of the game instance to play
 *
 * State:
 *  - game: The current game being played
 *
 * GameDetails -> PlayGame -> GameBoard
 * /games/{gameId} -> PlayGame -> GameBoard
 */
function PlayGame() {
  console.log("PlayGame re-rendered");
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [gameManager, setGameManager] = useState(null);
  const [renderToggle, setRenderToggle] = useState(false);

  useEffect(function initializeGameManagerEffect(){
    async function initializeGameManager(){
      const newGameManager = new GameManager(gameId, forceReRender);
      await newGameManager.initialize();
      setGameManager(newGameManager);
      setIsLoading(false);
    }
    console.log("initializeGameManagerFetch() called; component re-mounted or gameId changed");
    initializeGameManager();
  }, [gameId]);

  /** Used by the game manager as a callback function to force re-render when game state is updated  */
  function forceReRender() {
    console.log("PlayGame.forceReRender() called");
    setRenderToggle( prevValue => { return !prevValue; } );
  }

  /** Called when a user clicks on the start or re-start button */
  async function startGame() {
    // console.log("startGame() called");
    await gameManager.startGame();
  }

  /** Called when a user clicks the button to delete the current game */
  async function deleteGame() {
    // console.log("deleteGame() called");
    await gameManager.deleteGame();
    navigate(`/`);
  }

  /** Called when a user clicks the button to manage the players in a game */
  async function managePlayers() {
    // console.log("managePlayers() called");
    navigate(`/games/${gameId}`);
  }

  /** Called when a user drops a piece in a drop row */
  async function dropPiece(colIndex) {
    // console.log("dropPiece() called with colIndex:", colIndex);
    await gameManager.dropPiece(colIndex);
  }

  /** For debug purposes only */
  async function stopPolling() {
    gameManager.disablePolling();
  }

  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="PlayGame">
      <div className="PlayGame-summary">
        <div>Game ID: {gameId}</div>
        <div>Game State: {gameStates[gameManager.gameState]}</div>
      </div>
      <div className="PlayGame-players-title">Players</div>
      <PlayerList playerList={gameManager.players} />
      <div className="PlayGame-manageButtons">
        <button className="PlayGame-manageButtons-button" onClick={startGame}>
          {gameManager.gameState === 0 ? 'Start' : 'Restart'}
        </button>
        <button className="PlayGame-manageButtons-button" onClick={deleteGame}>
          Delete
        </button>
        <button className="PlayGame-manageButtons-button" onClick={managePlayers}>
          Manage Players
        </button>
        <button className="PlayGame-manageButtons-button" onClick={stopPolling}>
          Stop Polling
        </button>
      </div>
      <GameBoard
        gameState={gameManager.gameState}
        boardState={gameManager.board}
        gamePlayers={gameManager.players}
        dropPiece={dropPiece}>
      </GameBoard>
    </div>
  );
}

export default PlayGame;