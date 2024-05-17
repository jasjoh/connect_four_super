import { delay } from "./utils";
import ConnectFourServerApi from "./server";

const updateTurnsDelayInMs = 500;
const renderTurnsDelayInMs = 1000;

/** Provides functionality for managing the board state associated with a game */
export class GameManager {

  constructor(gameId, forceReRender) {
    this.gameId = gameId;
    this.forceReRender = forceReRender;

    this.isPolling = false;
    this.pollForTurns = false;

    this.clientTurns = undefined;
    this.clientTurnIdsSet = undefined;
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
    this.gameEnding();
    this.clientTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    this.clientTurnIdsSet = new Set(this.clientTurns.map(turn => turn.turnId));
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
  async conductPoll() {
    // console.log("GameManager.conductPoll() called");
    const newTurns = await this.getNewTurns();
    // console.log("newTurns:", newTurns);
    for (let turn of newTurns) {
      // console.log("updating client turn array and board with new turn");
      this.clientTurns.push(turn);
      this.clientTurnIdsSet.add(turn.turnId);
      // console.log("clientTurnsSet updated with new turn:", this.clientTurnsSet);
      this.updateBoardWithTurn(turn);
      // console.log("board updated with new turn:", this.board);
      this.forceReRender(); // call callback to re-render
      await delay(renderTurnsDelayInMs);
    }
    if (newTurns.length > 0) {
      await this.updateLocalGame();
      this.gameEnding();
    }
  }

  /** Returns the set of new turns based on comparing this.clientTurnsSet
   * against a provided list of serverTurns and returning any server turns
   * not found in the client turns list.
   */
  async getNewTurns() {
    const serverTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    const newTurns = serverTurns.filter(turn => !this.clientTurnIdsSet.has(turn.turnId));
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

  /** Checks for and handles games which are won or tied */
  gameEnding() {
    if (this.gameState === 2) {
      // game is won
      this.pollForTurns = false;
      this.isPolling = false;
      highlightWinningCells(this);
      this.forceReRender(); // call callback to re-render
    } else if (this.gameState === 3) {
      // game is tied
      this.pollForTurns = false;
      this.isPolling = false;
      this.forceReRender(); // call callback to re-render
    }

    function highlightWinningCells(parent) {
      for (let cell of parent.game.winningSet) {
        parent.board[cell[0]][cell[1]].highlight = true;
      }
    }
  }

  /** Drops a piece at the specified column for the current player associated with
   * the game associated with this game manager
   */
  async dropPiece(column) {
    if (this.gameState !== 1) {
      console.log("WARNING: Piece dropped while game is not in STARTED state.");
      return;
    }
    await ConnectFourServerApi.dropPiece(this.gameId, this.currPlayerId, column);
    await this.conductPoll();
  }

  /** Starts (or re-starts) the game associated with this game manager */
  async startGame() {
    await ConnectFourServerApi.startGame(this.gameId);
    await this.initialize();
    this.forceReRender();
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
      await this.conductPoll();
      await delay(updateTurnsDelayInMs);
    }
  }
}