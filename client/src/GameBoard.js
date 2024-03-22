import "./GameBoard.css"
import BoardPlayRow from "./BoardPlayRow";
import BoardDropRow from "./BoardDropRow";

/** Displays the game board containing multiple cells
 *
 * Props:
 *  - boardState: The active game's state which includes:
 *  --- the height and width of the board
 *  --- where any game pieces have been placed and their color
 *  --- the winning set of game pieces (if they exist)
 *  - dropPiece(): A callback function for when a player attempts to drop a piece
 *
 * State:
 *  - None
 *
 * Main -> GameBoard -> [ BoardDropRow, BoardPlayRow ] */
function GameBoard({ boardState, dropPiece }) {
  // console.log("GameBoard re-rendered");
  // console.log("called w/ boardState:", boardState);
  /**
   * boardState structure:
   * - each row (y) is an array of cell states
   * - each cell state (x) is either null or a player ID   *
   * - For each row, we need to render that row, passing the Row component
   * - its row state (an array of either null or player ID values)
   * */

  // Build array of BoardPlayRows
  let boardPlayRowsJsx = boardState.map( (row, index) => {
    // console.log("new play row being added for row, index:", row, index);
    return <BoardPlayRow key={index} rowState={row} />;
  })

  return (
    <div className="GameBoard">
      <table className="GameBoard-board"><tbody>
        <BoardDropRow width={ boardState[0].length } dropPiece={ dropPiece }/>
        { boardPlayRowsJsx.map( row => row ) }
      </tbody></table>
    </div>
  );
}

export default GameBoard;