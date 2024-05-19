import ConnectFourServerApi from "../server";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameStates } from "../utils.js";

import "./GameDetails.css";

import NavBar from "./NavBar.js";
import PlayerList from "./PlayerList.js";
import AddPlayerToGameModal from "./AddPlayerToGameModal.js";
import LoadingSpinner from "./LoadingSpinner.js";
import GameDetailsPropertyList from "./GameDetailsPropertyList.js";

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
    console.log("GameDetails re-rendered");

    const [game, setGame] = useState(null);
    const [gamePlayers, setGamePlayers] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { gameId } = useParams();
    const navigate = useNavigate();

    useEffect(function fetchGameAndPlayersEffect(){
      async function fetchGameAndPlayers(){
        const game = await ConnectFourServerApi.getGame(gameId);
        // console.log("retrieved game:", game);
        setGame(game);
        const players = await ConnectFourServerApi.getPlayersForGame(gameId);
        // console.log("retrieved players:", players);
        setGamePlayers(players);
        setIsLoading(false);
      }
      // console.log("fetchGameAndPlayerEffect() called; component re-mounted or gameId changed");
      fetchGameAndPlayers();
    }, [gameId])

    async function removePlayer(playerId) {
      // console.log("removePlayer() called for player ID:", playerId);
      await ConnectFourServerApi.removePlayerFromGame(gameId, playerId);
      const updatedGamePlayers = await ConnectFourServerApi.getPlayersForGame(gameId);
      setGamePlayers(updatedGamePlayers);
    }

    async function addPlayerToGame(playerId) {
      // console.log("addPlayerToGame() called for player ID:", playerId);
      await ConnectFourServerApi.addPlayersToGame(gameId, [playerId]);
      const updatedGamePlayers = await ConnectFourServerApi.getPlayersForGame(gameId);
      setGamePlayers(updatedGamePlayers);
    }

    async function playGame() {
      // console.log("playGame() called");
      navigate(`/games/${gameId}/play`);
    }

    async function deleteGame() {
      // console.log("deleteGame() called");
      await ConnectFourServerApi.deleteGame(gameId);
      navigate(`/`);
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (isLoading) return ( <LoadingSpinner /> );

    return (
      <div className="GameDetails">
        <AddPlayerToGameModal
          isOpen={isModalOpen}
          gameId={gameId}
          gamePlayers={gamePlayers}
          closeModal={closeModal}
          addPlayerToGame={addPlayerToGame} />
        <div className="GameDetails-gameDetails">
          <div className="GameDetails-gameDetails-title">Game Details</div>
          <GameDetailsPropertyList gameData={game.gameData} />
          <div className="GameDetails-buttons">
            <button onClick={playGame} className="GameDetails-gameDetails-button">Play</button>
            <button onClick={deleteGame} className="GameDetails-gameDetails-button">Delete</button>
            <button onClick={openModal} className="GameDetails-gameDetails-button">Add Player</button>
          </div>
        </div>
        <div className="GameDetails-gamePlayers">
          { gamePlayers.length > 0 ?
          ( <PlayerList playerList={gamePlayers} action={removePlayer} actionType={'removePlayer'} /> ) :
          ( <div>No Players Added to Game</div> ) }
        </div>
      </div>
    );
  }

  export default GameDetails;