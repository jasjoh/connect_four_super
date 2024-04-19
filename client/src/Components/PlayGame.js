import ConnectFourServerApi from "../server";
import { GameTurnsManager } from "../gameTurnsManager.js";
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
  // console.log("PlayGame re-rendered");

  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [gamePlayers, setGamePlayers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameTurnsManager, setGameTurnsManager] = useState(null);

  useEffect(function initialGameStateEffect(){
    async function initializeGameState(){
      const game = await ConnectFourServerApi.getGame(gameId);
      console.log("retrieved game:", game);
      setGame(game);
      const players = await ConnectFourServerApi.getPlayersForGame(gameId);
      console.log("retrieved players:", players);
      setGamePlayers(players);
      const newGameTurnsManager = new GameTurnsManager(gameId, setGameTurnsManager);
      setGameTurnsManager(newGameTurnsManager);
      console.log("gameTurnsManager created and set in state:", newGameTurnsManager);
      setIsLoading(false);
    }
    console.log("fetchGameAndPlayerEffect() called; component re-mounted or gameId changed");
    initializeGameState();
  }, [gameId])

  async function startGame() {
    console.log("startGame() called");
    await ConnectFourServerApi.startGame(gameId);
    gameTurnsManager.enablePolling();
  }

  async function deleteGame() {
    console.log("deleteGame() called");
    await ConnectFourServerApi.deleteGame(gameId);
    navigate(`/`);
  }

  async function managePlayers() {
    console.log("managePlayers() called");
    navigate(`/games/${game.id}`);
  }

  async function dropPiece(colIndex) {
    console.log("dropPiece() called with colIndex:", colIndex);
    await ConnectFourServerApi.dropPiece(game.id, game.currPlayerId, colIndex);
    const updatedGame = await ConnectFourServerApi.getGame(game.id);
    setGame(updatedGame);
  }

  if (isLoading) return <div><p>Loading...</p></div>

  if (game.gameState > 1) { gameTurnsManager.disablePolling(); }

  return (
    <div className="PlayGame">
      <div className="PlayGame-summary">
        <div>Game ID: {gameId}</div>
        <div>Game State: {gameStates[game.gameState]}</div>
      </div>
      <div className="PlayGame-players-title">Players</div>
      <PlayerList playerList={gamePlayers} />
      <div className="PlayGame-manageButtons">
        <button className="PlayGame-manageButtons-button" onClick={startGame}>
          {game.gameState === 0 ? 'Start' : 'Restart'}
        </button>
        <button className="PlayGame-manageButtons-button" onClick={deleteGame}>
          Delete
        </button>
        <button className="PlayGame-manageButtons-button" onClick={managePlayers}>
          Manage Players
        </button>
      </div>
      <GameBoard
        boardState={game.boardData}
        gamePlayers={gamePlayers}
        dropPiece={dropPiece}>
      </GameBoard>
    </div>
  );
}

export default PlayGame;