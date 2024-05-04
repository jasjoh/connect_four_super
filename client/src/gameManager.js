import { delay } from "./utils";
import ConnectFourServerApi from "./server";

const updateTurnsDelayInMs = 500;
const renderTurnsDelayInMs = 1000;

/** Provides functionality for managing the board state associated with a game */
export class GameManager {

  constructor(game, setBoard) {
    this.clientTurns = [];
    this.board = this.initializeClientBoard(game.boardData);
    console.log("GameManager.board initialized on construction:", this.board);
    this.gameId = game.id;
    this.setBoard = setBoard;
    this.isPolling = false;
    this.pollForTurns = false;
  }

  /** Internal conductor function to update board state and call callback function
   * to update React state for PlayGame
   */
  async updateBoard() {
    console.log("GameManager.updateBoard() called");
    const newTurns = await this.getNewTurns();
    console.log("newTurns:", newTurns);
    for (let turn of newTurns) {
      console.log("updating client turn array and board with new turn");
      this.clientTurns.push(turn);
      console.log("clientTurns updated with new turn:", this.clientTurns);
      this.updateBoardWithTurn(turn);
      console.log("board updated with new turn:", this.board);
      this.setBoard(this.board); // call callback to re-render
      await delay(renderTurnsDelayInMs);
    }
  }

  /** Returns the set of new turns based on comparing this.clientTurns
   * against a provided list of serverTurns and returning any server turns
   * not found in the client turns list.
   */
  async getNewTurns() {
    console.log("getNewTurns() called");
    const serverTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    console.log(`server turns retrieved:`, serverTurns);
    const newTurnCount = serverTurns.length - this.clientTurns.length;
    console.log("newTurnCount calculated as:", newTurnCount);
    const newTurns = [];
    let turnsAdded = 0;
    while (turnsAdded < newTurnCount) {
      console.log("adding a new turn");
      turnsAdded++;
      newTurns.unshift(serverTurns[serverTurns.length - turnsAdded]);
    }
    return newTurns;
  }

  /** Initializes the client-side representation of the game board on construction
   * boardData: [ [ { playerId, validCoordSets } ] ]
  */
  initializeClientBoard(boardData) {
    console.log("initializeClientBoard called with boardData:", boardData);
    const board = [];
    for (let row of boardData) {
      const clientRow = [];
      for (let col of row) {
        const tileState = {
          playerId: col.playerId,
          highlight: false
        }
        clientRow.push(tileState);
      }
      board.push(clientRow);
    }
    return board;
  }

  /** Updates this.board with the provide turn object:
   * { turnId, location, playerId, gameId, createdOnMs } */
  updateBoardWithTurn(turn) {
    this.board[turn.location[0]][turn.location[1]].playerId = turn.playerId;
  }

  /** Enables polling and initiates polling (via this.poll()) */
  enablePolling() {
    this.pollForTurns = true;
    if (!this.isPolling) {
      this.isPolling = true;
      this.poll();
    }
  }

  /** Disables polling such that on next poll, polling will cease. */
  disablePolling() {
    this.isPolling = false;
    this.pollForTurns = false;
  }

  /** Polling function which calls this.updateTurns() and then
   * awaits updateTurnsDelayInMs to transpire before calling again.
   */
  async poll() {
    while (this.pollForTurns) {
      await this.updateBoard();
      await delay(updateTurnsDelayInMs);
    }
  }
}