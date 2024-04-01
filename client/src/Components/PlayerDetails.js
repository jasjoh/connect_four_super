import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NavBar from "./NavBar.js";

// import "./PlayerDetails.css";

/** Displays the details of a player
 *
 * Props:
 *  - playerId: The ID of a player
 *
 * State:
 *  - player: The player object
 *  - isLoading: Used for keeping track of whether player data is loaded or not
 *
 * PlayerList -> PlayerDetails */
  function PlayerDetails() {
    // console.log("PlayerDetails re-rendered");

    const [player, setPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { playerId } = useParams();

    useEffect(function fetchPlayersEffect(){
      async function fetchPlayer(){
        const player = await ConnectFourServerApi.getPlayer(playerId);
        console.log("retrieved player:", player);
        setPlayer(player);
        setIsLoading(false);
      }
      fetchPlayer();
    }, [playerId])

    if (isLoading) return <div><p>Loading...</p></div>

    return (
      <div className="PlayerDetails">
        <NavBar />
        <span>Player ID: ${playerId}</span>
      </div>
    );
  }

  export default PlayerDetails;