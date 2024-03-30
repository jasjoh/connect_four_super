import { useNavigate } from 'react-router-dom';
import "./PlayerListing.css";

/** Displays a specific player listing
 *
 * Props:
 *  - player: A player object like:
 *
 *    id: string;
      name: string;
      color: string;
      ai: boolean;
      createdOn: timestamp;
 *
 * State:
 *  - None
 *
 * PlayerList -> PlayerListing */
  function PlayerListing({ player }) {
    // console.log("PlayerListing re-rendered");

    const navigate = useNavigate();

    function playerClick(evt) {
      console.log("Player row clicked. Navigating to:", `/players/${player.id}`);
      navigate(`/players/${player.id}`);
    }

    return (
      <tr onClick={playerClick} className="PlayerListing-tr">
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
      </tr>
    );
  }

      export default PlayerListing;