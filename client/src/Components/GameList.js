import "./GameList.css";

import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import GameListing from "./GameListing";
import GameCreateForm from "./GameCreateForm";

/** Displays the list of available games
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

  const [gameList, setGameList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchGameListOnMount(){
    async function fetchGameListings(){
      const gameList = await ConnectFourServerApi.getGames();
      console.log("retrieved gameList:", gameList);
      setGameList(gameList);
      setIsLoading(false);
    }
    fetchGameListings();
  }, [])

  async function createGame(formData) {
    console.log("GameList createGame() form called with:", formData);
    await ConnectFourServerApi.createGame(formData);
    const updatedGameList = await ConnectFourServerApi.getGames();
    setGameList(updatedGameList);
  }

  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="GameList">
      <GameCreateForm createGame={createGame}/>
      <div className="GameList-list">
      {gameList.map( (g, index) => <GameListing
        key={index}
        game={g}/>)
      }
      </div>
    </div>
  );
}

export default GameList;