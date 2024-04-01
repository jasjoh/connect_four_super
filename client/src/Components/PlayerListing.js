// import { useNavigate } from 'react-router-dom';
import "./PlayerListing.css";

/** Displays a specific player listing
 *
 * Props:
 *  - player: A player object like: *
 *    id: string;
      name: string;
      color: string;
      ai: boolean;
      createdOn: timestamp;

 * - deletePlayer: A callback function to delete a player

 * State:
 *  - None
 *
 * PlayerList -> PlayerListing */
  function PlayerListing({ player, deletePlayer, gamePlayers }) {
    // console.log("PlayerListing re-rendered");

    // const navigate = useNavigate();

    function buttonClick(evt) {
      console.log(`deletePlayer button clicked; calling deletePlayer() callback`);
      deletePlayer(player.id);
    }

    // onClick={playerClick}
    return (
      <tr className="PlayerListing-tr">
        <td className="PlayerListing-td">{`${player.id}`}</td>
        <td className="PlayerListing-td">{`${player.name}`}</td>
        <td className="PlayerListing-td"
          style={{
            backgroundColor: `${player.color}`,
            width: `20px`
          }}
        >{`${player.color}`}</td>
        <td className="PlayerListing-td">{`${player.ai}`}</td>
        <td className="PlayerListing-td">{`${player.createdOn}`}</td>
        { deletePlayer ?
          (
            <td className="PlayerListing-td-button" onClick={buttonClick}>
              <button>
                {gamePlayers ? 'REMOVE' : 'DELETE'}
              </button>
            </td>
          ) : (
            <td className="PlayerListing-td"></td>
          )
        }
      </tr>
    );
  }

export default PlayerListing;