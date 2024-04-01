import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NavBar from "./NavBar.js";

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

    useEffect(function fetchGameAndPlayersEffect(){
      async function fetchGame(){
        const game = await ConnectFourServerApi.getGame(gameId);
        console.log("retrieved game:", game);
        setGame(game);
      }
      async function fetchPlayers(){
        const players = await ConnectFourServerApi.getPlayersForGame(gameId);
        console.log("retrieved players:", players);
        setGamePlayers(players);
      }
      console.log("fetchGameAndPlayerEffect() called; component re-mounted or gameId changed");
      fetchGame();
      fetchPlayers();
      setIsLoading(false);
    }, [gameId])

    if (isLoading) return <div><p>Loading...</p></div>

    return (
      <div className="GameDetails">
        <NavBar />
        <span>Game ID: ${gameId}</span>
      </div>
    );
  }

  export default GameDetails;