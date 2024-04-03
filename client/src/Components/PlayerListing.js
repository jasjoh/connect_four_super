// import { useNavigate } from 'react-router-dom';
import "./PlayerListing.css";

/** Displays a specific player listing
 *
 * Props:
 *  - action: callback function representing the action available for each player
 *  - actionType: the type of action ('deletePlayer', 'addPlayer', 'removePlayer')
 *  - player: A player object like: *
 *    id: string;
      name: string;
      color: string;
      ai: boolean;
      createdOn: timestamp;

 * State:
 *  - None
 *
 * PlayerList -> PlayerListing */
  function PlayerListing({ player, action, actionType }) {
    // console.log("PlayerListing re-rendered");

    // const navigate = useNavigate();

    let buttonText = '';

    switch(actionType) {
      case 'deletePlayer':
        buttonText = 'DELETE'
        break;
      case 'removePlayer':
        buttonText = 'REMOVE'
        break;
      case 'addPlayerToGame':
        buttonText = 'ADD TO GAME'
        break;
      default:
        break;
    }

    function buttonClick(evt) {
      console.log(`action button clicked; calling provided action callback`);
      action(player.id);
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
        { action ?
          (
            <td className="PlayerListing-td-button" onClick={buttonClick}>
              <button>{buttonText}</button>
            </td>
          ) : (
            <td className="PlayerListing-td"></td>
          )
        }
      </tr>
    );
  }

export default PlayerListing;