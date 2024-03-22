import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import GameListing from "./GameListing";

/** Displays the list of games
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
  console.log("GameList re-rendered");

  const [gameList, setGameList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchGameListOnMount(){
    async function fetchGameListings(){
      const gameList = await ConnectFourServerApi.getAllGames();
      console.log("retrieved gameList:", gameList);
      setGameList(gameList);
      setIsLoading(false);
    }
    fetchGameListings();
  }, [])

  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="GameList">
      {gameList.map( (g, index) => <GameListing
        key={index}
        game={g}/>)}
    </div>
  );
}

export default GameList;