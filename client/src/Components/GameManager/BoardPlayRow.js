// import "./GameDropRow.css"
import BoardPlayCell from "./BoardPlayCell";

/** Displays a row where game pieces end up after being dropped
 *
 * Props:
 *  - width: The width (# of cells) that should be rendered
 *  - dropPiece(): A callback function for when a player attempts to drop a piece
 *
 * State:
 *  - None
 *
 * GameBoard -> BoardPlayRow -> BoardPlayCell */
function BoardPlayRow({ rowState }) {
  // console.log("BoardPlayRow re-rendered");
  // console.log("rowState passed in is:", rowState);

  let cellsJsx = [];
  for (let i = 0; i < rowState.length; i++) {
    let color = undefined;
    let highlight = false;
    if (rowState[i].player) { color = rowState[i].player.color; }
    if (rowState[i].highlight) { highlight = true; }
    cellsJsx.push(
      <BoardPlayCell key={i} highlight={highlight} color={color} />
    )
  }

  return (<tr className="BoardPlayRow">{ cellsJsx.map( cell => cell ) }</tr>);
}

export default BoardPlayRow;