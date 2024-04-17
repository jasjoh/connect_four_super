import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameStates } from "../utils.js";
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

  const [game, setGame] = useState(null);
  const [gamePlayers, setGamePlayers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(function fetchGameAndPlayersEffect(){
    async function fetchGameAndPlayers(){
      const game = await ConnectFourServerApi.getGame(gameId);
      console.log("retrieved game:", game);
      setGame(game);
      const players = await ConnectFourServerApi.getPlayersForGame(gameId);
      console.log("retrieved players:", players);
      setGamePlayers(players);
      setIsLoading(false);
    }
    console.log("fetchGameAndPlayerEffect() called; component re-mounted or gameId changed");
    fetchGameAndPlayers();
  }, [gameId])

  async function startGame() {
    console.log("startGame() called");
    await ConnectFourServerApi.startGame(gameId);
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

  function dropPiece() {
    console.log("dropPiece() called");
  }

  if (isLoading) return <div><p>Loading...</p></div>

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
          {game.gameState === 1 ? 'Restart' : 'Start'}
        </button>
        <button className="PlayGame-manageButtons-button" onClick={deleteGame}>
          Delete
        </button>
        <button className="PlayGame-manageButtons-button" onClick={managePlayers}>
          Manage Players
        </button>
      </div>
      <GameBoard boardState={game.boardData} dropPiece={dropPiece}></GameBoard>
    </div>
  );
}

export default PlayGame;