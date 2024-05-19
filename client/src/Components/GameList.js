import "./GameList.css";

import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import GameListing from "./GameListing";
import GameCreateForm from "./GameCreateForm";
import LoadingSpinner from "./LoadingSpinner";

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
      // console.log("fetchGameListOnMount() called thus component is being re-mounted");
      const gameList = await ConnectFourServerApi.getGames();
      // console.log("retrieved gameList:", gameList);
      setGameList(gameList);
      setIsLoading(false);
    }
    fetchGameListings();
  }, [])

  async function createGame(formData) {
    // console.log("GameList createGame() form called with:", formData);
    await ConnectFourServerApi.createGame(formData);
    const updatedGameList = await ConnectFourServerApi.getGames();
    setGameList(updatedGameList);
  }

  if (isLoading) return ( <LoadingSpinner /> );

  return (
    <div className="GameList">
      <GameCreateForm createGame={createGame}/>
      <div className="GameList-list">
        <div className="GameList-title">
          Existing Games
        </div>
        <div className="GameList-subTitle">
          Click a Row to View Details, Manage and Play
        </div>
        <table className="GameList-table">
          <thead className="GameList-thead">
            <tr>
              <td className="GameList-td">{`Game ID`}</td>
              <td className="GameList-td">{`Game State`}</td>
              <td className="GameList-td">{`Created On`}</td>
              <td className="GameList-td">{`Total Players`}</td>
            </tr>
          </thead>
          <tbody className="GameList-tbody">
            { gameList.map( (g, index) => <GameListing
              key={index}
              game={g}/>
            ) }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameList;