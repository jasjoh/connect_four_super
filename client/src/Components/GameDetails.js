import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameStates } from "../utils.js";

import "./GameDetails.css";

import NavBar from "./NavBar.js";
import PlayerList from "./PlayerList.js";

// import "./GameDetails.css";

/** Displays the details of a game
 *
 * Props:
 *  - gameId: The ID of a game
 *
 * State:
 *  - game: The game object
 *  - isLoading: Used for keeping track of whether game data is loaded or not
 *
 * PlayerList -> GameDetails */
  function GameDetails() {
    // console.log("GameDetails re-rendered");

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

    async function removePlayer(playerId) {
      console.log("removePlayer() called for player ID:", playerId);
      await ConnectFourServerApi.removePlayerFromGame(gameId);
      const updatedGamePlayers = ConnectFourServerApi.getPlayersForGame(gameId);
      setGamePlayers(updatedGamePlayers);
    }

    async function addPlayerToGame(playerId) {
      console.log("addPlayerToGame() called for player ID:", playerId);
      await ConnectFourServerApi.addPlayersToGame(gameId, [playerId]);
      const updatedGamePlayers = ConnectFourServerApi.getPlayersForGame(gameId);
      setGamePlayers(updatedGamePlayers);
    }

    async function playGame() {
      console.log("playGame() called");
      await ConnectFourServerApi.startGame(gameId);
      navigate(`/games/${game.id}/play`);
    }

    async function deleteGame() {
      console.log("deleteGame() called");
      await ConnectFourServerApi.deleteGame(gameId);
      navigate(`/`);
    }

    if (isLoading) return <div><p>Loading...</p></div>

    return (
      <div className="GameDetails">
        <NavBar />
        <div className="GameDetails-gameDetails">
          <span className="GameDetails-gameDetails-title">Game Details</span>
          <button onClick={playGame} className="GameDetails-gameDetails-button">Play</button>
          <button onClick={deleteGame} className="GameDetails-gameDetails-button">Delete</button>
          <div>Game ID: {gameId}</div>
          <div>Game State: {gameStates[game.gameState]}</div>
        </div>
        <div className="GameDetails-gamePlayers">
          <span className="GameDetails-gamePlayers-title">Game Players</span>
          <button className="GameDetails-gamePlayers-button">Add Player</button>
          { gamePlayers.length > 0 ?
          ( <PlayerList players={gamePlayers} deletePlayer={removePlayer} gamePlayers={true} /> ) :
          ( <div>No Players Added to Game</div> ) }
        </div>
      </div>
    );
  }

  export default GameDetails;