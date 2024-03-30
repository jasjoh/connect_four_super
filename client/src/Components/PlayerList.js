import "./PlayerList.css";

import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import PlayerListing from "./PlayerListing.js";
import PlayerCreateForm from "./PlayerCreateForm.js";

/** Displays the list of existing players
 *
 * Props:
 *  - None
 *
 * State:
 *  - games: The games retrieved from the server
 *  - isLoading: A flag to keep track of whether games have been loaded
 *
 * Main -> GameList */
function GameList() {
  // console.log("GameList re-rendered");

  const [playerList, setPlayerList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchPlayerListOnMount(){
    async function fetchPlayerListings(){
      const playerList = await ConnectFourServerApi.getPlayers();
      console.log("retrieved playerList:", playerList);
      setPlayerList(playerList);
      setIsLoading(false);
    }
    fetchPlayerListings();
  }, [])

  async function createPlayer(formData) {
    console.log("PlayerList createPlayer() form called with:", formData);
    await ConnectFourServerApi.createPlayer(formData);
    const updatedPlayerList = await ConnectFourServerApi.getPlayers();
    setPlayerList(updatedPlayerList);
  }

  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="PlayerList">
      <PlayerCreateForm createPlayer={createPlayer} />
      <div className="PlayerList-list">
        {
          playerList.map( (p, index) => <PlayerListing
          key={index}
          player={p}/>)
        }
      </div>
    </div>
  );
}

export default GameList;