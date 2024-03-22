// import "./BoardPlayCell.css"
import GamePiece from "./GamePiece";

/** An individual cell in the game board where pieces may exist once dropped
 *
 * Props:
 *  - highlight: whether to highlight the cell as part of a winning set
 *  - placed: whether a game piece has been placed in this cell
 *
 * State:
 *  - None
 *
 * BoardPlayRow -> BoardPlayCell -> GamePiece*/
function BoardPlayCell({ highlight=false, color=undefined}) {
  // console.log("BoardPlayCell re-rendered");

  let style = {}

  if (highlight) {
    style = { backgroundColor: '#c5c5c5' }
  }

  return (
    <td className="BoardPlayCell" style={style}>
      { color !== undefined ? <GamePiece color={color}/> : null }
    </td>
  );
}

export default BoardPlayCell;