import "./PlayerList.css";

import PlayerListing from "./PlayerListing.js";


/** Displays the list of existing players
 *
 * Props:
 *  - deletePlayer: callback function to delete a player
 *  - playerList: an array [] of players to display in a list
 *  -- player object like:  *
 *    id: string;
      name: string;
      color: string;
      ai: boolean;
      createdOn: timestamp;
 *
 * State:
 *  - none
 *
 * PlayerListAndCreate -> PlayerList -> PlayerListing */
function PlayerList({deletePlayer, playerList}) {
  // console.log("PlayerList re-rendered");

  return (
    <div className="PlayerList">
      <table className="PlayerList-table">
        <thead className="PlayerList-thead">
          <tr>
            <td className="PlayerList-td">{`ID`}</td>
            <td className="PlayerList-td">{`Name`}</td>
            <td className="PlayerList-td">{`Color`}</td>
            <td className="PlayerList-td">{`AI Flag`}</td>
            <td className="PlayerList-td">{`Created On`}</td>
            <td className="PlayerList-td"></td>
          </tr>
        </thead>
        <tbody className="PlayerList-tbody">
        {
          playerList.map( (p, index) => <PlayerListing
          key={index}
          player={p}
          deletePlayer={deletePlayer}
          gamePlayers={false} />)
        }
        </tbody>
      </table>
    </div>
  );
}

export default PlayerList;