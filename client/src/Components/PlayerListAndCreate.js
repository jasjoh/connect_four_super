// import "./PlayerListAndCreate.css";

import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import PlayerList from "./PlayerList.js";
import PlayerCreateForm from "./PlayerCreateForm.js";

/** Displays the list of existing players
 *
 * Props:
 *  - None
 *
 * State:
 *  - playerList: The list of all players (whether they are part of games or not)
 *  - isLoading: A flag to keep track of whether games have been loaded
 *
 * Main -> PlayerListAndCreate -> PlayerList / PlayerCreateForm */
function PlayerListAndCreate() {
  // console.log("PlayerListAndCreate re-rendered");

  const [playerList, setPlayerList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchPlayerListOnMount(){
    async function fetchPlayerListings(){
      console.log("fetchPlayerListOnMount() called thus component is being re-mounted");
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

  async function deletePlayer(formData) {
    console.log("PlayerList deletePlayer() form called with:", formData);
    await ConnectFourServerApi.deletePlayer(formData);
    const updatedPlayerList = await ConnectFourServerApi.getPlayers();
    setPlayerList(updatedPlayerList);
  }

  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="PlayerListAndCreate">
      <PlayerCreateForm createPlayer={createPlayer} />
      <PlayerList deletePlayer={deletePlayer} playerList={playerList} />
    </div>
  );
}

export default PlayerListAndCreate;