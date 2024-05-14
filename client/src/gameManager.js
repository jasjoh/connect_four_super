import { delay } from "./utils";
import ConnectFourServerApi from "./server";

const updateTurnsDelayInMs = 500;
const renderTurnsDelayInMs = 1000;

/** Provides functionality for managing the board state associated with a game */
export class GameManager {

  constructor(gameId, forceReRender) {
    this.gameId = gameId;
    this.forceReRender = forceReRender;

    this.clientTurns = [];
    this.isPolling = false;
    this.pollForTurns = false;

    this.game = undefined;
    this.board = undefined;
    this.gameState = undefined;
    this.players = undefined;
    this.currPlayerId = undefined;
  }

  // called to asynchronously initialize the game manager using server state
  async initialize() {
    await this.updateLocalGame();
    this.board = this.initializeClientBoard();
    this.players = await ConnectFourServerApi.getPlayersForGame(this.gameId);
    if (this.gameState === 1) {
      this.enablePolling();
    }
  }

  // called to fetch an updated version of the game and populate local state
  async updateLocalGame() {
    this.game = await ConnectFourServerApi.getGame(this.gameId);
    this.gameState = this.game.gameState;
    this.currPlayerId = this.game.currPlayerId;
  }

  /** Internal conductor function to handle all operations that take place during
   * a polling sessions including any callbacks to React to re-render if needed
   */
  async pollingConductor() {
    // console.log("GameManager.pollingConductor() called");
    const newTurns = await this.getNewTurns();
    // console.log("newTurns:", newTurns);
    for (let turn of newTurns) {
      // console.log("updating client turn array and board with new turn");
      this.clientTurns.push(turn);
      // console.log("clientTurns updated with new turn:", this.clientTurns);
      this.updateBoardWithTurn(turn);
      // console.log("board updated with new turn:", this.board);
      this.forceReRender(); // call callback to re-render
      await delay(renderTurnsDelayInMs);
    }
    if (newTurns.length > 0) {
      await this.updateLocalGame();
      if (this.gameState > 1) {
        this.disablePolling();
      }
    }
  }

  /** Returns the set of new turns based on comparing this.clientTurns
   * against a provided list of serverTurns and returning any server turns
   * not found in the client turns list.
   */
  async getNewTurns() {
    // console.log("getNewTurns() called");
    const serverTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    // console.log(`server turns retrieved:`, serverTurns);
    const newTurnCount = serverTurns.length - this.clientTurns.length;
    // console.log("newTurnCount calculated as:", newTurnCount);
    const newTurns = [];
    let turnsAdded = 0;
    while (turnsAdded < newTurnCount) {
      // console.log("adding a new turn");
      turnsAdded++;
      newTurns.unshift(serverTurns[serverTurns.length - turnsAdded]);
    }
    return newTurns;
  }

  /** Initializes the client-side representation of the game board on construction
   * boardData: [ [ { playerId, validCoordSets } ] ]
  */
  initializeClientBoard() {
    // console.log("initializeClientBoard called with boardData:", boardData);
    const board = [];
    for (let row of this.game.boardData) {
      const clientRow = [];
      for (let col of row) {
        const tileState = {
          playerId: null,
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

  /** Drops a piece at the specified column for the current player associated with
   * the game associated with this game manager
   */
  async dropPiece(column) {
    await ConnectFourServerApi.dropPiece(this.gameId, this.currPlayerId, column);
    await this.pollingConductor();
  }

  /** Starts (or re-starts) the game associated with this game manager */
  async startGame() {
    await ConnectFourServerApi.startGame(this.gameId);
    this.enablePolling();
  }

  /** Deletes the game associated with this game manager */
  async deleteGame() {
    this.disablePolling();
    await ConnectFourServerApi.deleteGame(this.gameId);
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
      await this.pollingConductor();
      await delay(updateTurnsDelayInMs);
    }
  }
}