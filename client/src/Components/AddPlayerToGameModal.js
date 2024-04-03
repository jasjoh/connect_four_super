import "./AddPlayerToGameModal.css";

import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import PlayerList from "./PlayerList.js";

/** Displays a list of players to add to a game and allows adding them
 *
 * Props:
 *  - isOpen: a flag indicating whether to render content in this modal
 *  - gameId: the gameId to add players to (in order to filter avail players)
 *  - closeModal: a callback function which closes (hides) the modal
 *
 * State:
 *  - playerList: The list of players available to add to a game
 *  - isLoading: A flag to keep track of whether players have been loaded
 *
 * GameDetails -> AddPlayerToGameModal -> PlayerList */
function AddPlayerToGameModal({isOpen, gamePlayers, closeModal, gameId, addPlayerToGame}) {
  console.log("AddPlayerToGameModal re-rendered");

  const [availPlayersList, setAvailPlayerList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function fetchAndFilterPlayerListOnMount(){
    if (isOpen) {
      async function fetchAndFilterPlayerListings(){
        console.log("fetchPlayerListOnMount() called thus component is being re-mounted");
        const playerList = await ConnectFourServerApi.getPlayers();
        console.log("retrieved playerList:", playerList);
        console.log("performing player filter");
        const availPlayers = playerList.filter(p => {
          console.log(`evaluating player: ${p.id} from the list of all players.`);
          const matchedPlayers = gamePlayers.find(gp =>
            {
              console.log(`comparing player in game ${gp.id} and seeing if it matches that player: ${p.id}`)
              return gp.id === p.id;
            })
          console.log("matched players:", matchedPlayers);
          return matchedPlayers === undefined;
        })
        console.log("available players determined to be:", availPlayers);
        setAvailPlayerList(availPlayers);
        setIsLoading(false);
      }

      fetchAndFilterPlayerListings();
    }
  }, [gameId, isOpen, gamePlayers])

  // async function addPlayerToGame(playerId) {
  //   console.log("addPlayerToGame() called within AddPlayerToGameModal");
  //   await ConnectFourServerApi.addPlayersToGame([playerId]);
  //   setIsLoading(true);
  //   fetchAndFilterPlayerListings();
  // }


  if (!isOpen) return null
  if (isLoading) return <div><p>Loading...</p></div>

  return (
    <div className="AddPlayerToGameModal">
      <div className="AddPlayerToGameModal-overlay">
        <div className="AddPlayerToGameModal-content">
          <PlayerList action={addPlayerToGame} actionType={'addPlayerToGame'} playerList={availPlayersList} />
          <button onClick={closeModal}>Finished Adding Players</button>
        </div>
      </div>
    </div>
  );
}

export default AddPlayerToGameModal;