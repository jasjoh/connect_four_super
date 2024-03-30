// import "./PlayerListing.css";

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

        return (
          <div className="PlayerListing">
            <div className="PlayerListing-id">{`${player.id}`}</div>
          </div>
        );
      }

      export default PlayerListing;