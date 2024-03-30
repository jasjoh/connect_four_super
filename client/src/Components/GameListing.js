// import "./GameListing.css";

/** Displays a specific game listing
 *
 * Props:
 *  - game: A game object like:
 *
 *    id: string;
      gameState: number;
      placedPieces: number[][] | null;
      boardId: string,
      boardData: BoardDataType;
      boardWidth: number;
      boardHeight: number;
      winningSet: number[][] | null;
      currPlayerId: string | null;
      createdOn: Date;
      totalPlayers: number;
 *
 * State:
 *  - None
 *
 * GameList -> GameListing */
function GameListing({ game }) {
  // console.log("GameListing re-rendered");

  return (
    <div className="GameListing">
      <div className="GameListing-id">{`${game.id}`}</div>
    </div>
  );
}

export default GameListing;