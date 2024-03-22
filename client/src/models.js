import { generateMD5HashHex } from "./utils";

const delayInMs = 200;

function delay(ms) {
  /**
   * This creates a new Promise for delay purposes.
   * The Promise constructor takes two functions as parameters:
   * - resolve function (a function which if called resolves promise successfully)
   * - reject function (a function which if called resolves promise unsuccessfully)
   * In this case, we are only providing it the resolve function we will call
   * Our resolve function is an anonymous function which calls itself after a set time
   */

  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * A class representing a Player
 * Requires providing a name and color (in hex) for the player
 * Optionally allows specifying if the player is AI or not
 */
class Player {
  constructor(name, color, aiFlag=false) {
    this.name = name;
    this.color = color;
    this.ai = aiFlag;
    this.id = generateMD5HashHex(name);
  }
}

/**
 * Extends the Player class to represent an AI player
 * Has a takeTurn() method which attempts to drop a piece in a random col
 * Pauses delayInMs before taking it's turn after takeTurn() is called
 */
class AiPlayer extends Player {
  constructor(name, color) {
    super(name, color, true);
    this.availCols = [];
  }

  /** Called to have an AI player take its turn */
  async takeTurn(game) {
    console.log("I am taking my turn. I am:", this.name);
    await this._aiDropPiece(game);
  }

  /** Let's AI know it's a new game */
  newGame(game) {
    this.availCols = this._aiInitAvailCols(game);
  }

  /** Internal function that generates available columns to drop pieces in */
  _aiInitAvailCols(game) {
    let availCols = []
    let startCol = 0;
    try {
      while (startCol < game.width) {
        availCols.push(startCol);
        startCol++;
      }
    } catch (err) {
      if (err instanceof ReferenceError) {
        throw new Error(`${this.name} has not been added to a game.`)
      } else {
        throw err;
      }
    }
    return availCols;
  }

  /** Internal function which handles attempting to drop pieces */
  async _aiDropPiece(game) {
    console.log("_aiDropPiece() called for player:", this.name);
    await delay(delayInMs);
    let colToAttempt = Math.floor(Math.random() * this.availCols.length);
    if (await game.dropPiece(this.availCols[colToAttempt])) { return; }
    console.log("col was full so we're removing it from avail:", colToAttempt);
    this.availCols.splice(colToAttempt, 1);
    console.log("updated availCols after splice:", this.availCols);
    await this._aiDropPiece(game);
    return;
  }
}

/** Keeps track of a unique instance of the game */
class Game {
  constructor(aiCallback, height = 6, width = 7, ) {
    this.width = width;
    this.height = height;
    this.players = [];
    this.placedPieces = [];
    this.gameState = 0; // 0 = not started, 1 = started, 2 = won, 3 = tied
    this.board = this._createBoardState();
    this.aiCallback = aiCallback;
    this.winningSet = [];
  }

  /**
   * Adds a player to an initialized game
   * Usually called by a Player object indirectly via its join() method
   * */
  addPlayer(player) {
    //TODO: Error logic for player already added to game.
    console.log("game.addPlayer() called with:", player);
    this.players.push(player);
  }

  /**
   * Removes a player from an initialized game by passing their ID
   * Usually called by a Player object indirectly via it's leave() method
  */
  removePlayer(playerId) {
    //TODO: Error logic for player not existing
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === playerId) {
        this.players.splice(i, 1);
      }
    }
  }

  /** Starts a game once at least two players have been added */
  async startGame() {
    // console.log("game.startGame() called")
    if (this.players.length < 2) {
      throw new Error("Not enough players!");
    }

    // on game restart, need to reset these
    this.placedPieces = [];
    this.board = this._createBoardState();
    this.winningSet = [];

    this.gameState = 1;

    // let AI players know it's a new game
    for (let player of this.players) {
      if (player instanceof AiPlayer) {
        player.newGame(this);
      }
    }

    // select starting player
    await this._updateCurrPlayer(true);

    // console.log("game players:", this.players);
    // console.log("current player:", this.currPlayer);
  }

  /**
   * Attempts to drop a game piece into a provided column
   * If room exists, adds that piece to the lowest open slots and returns true
   * If room does NOT exist (column is full), returns false
   */
  async dropPiece(col) {
    // console.log("dropPiece() called for col:", col);

    // if the game is not active, ignore this request and return undefined
    if (this.gameState !== 1) { return; }

    // find the next available space (row) for the piece in the target column
    let targetRow = this._findEmptyCellInColumn(col);
    // console.log("target row found:", targetRow);
    if (targetRow === null) {
      // console.log("col was full, returning false to dropPiece()")
      return false;
    } // no space so ignore the click

    this._addToBoard(targetRow, col);

    // check for win condition
    await this._checkForGameEnd();
    return true;
  }

  /**
   * Creates the initial game board represented by a matrix of game pieces
   * where each game piece has a value and an array of coord sets which are
   * valid potential winning board piece sequences.
   */
  _createBoardState() {
    // console.log("createBoardState() called");

    const boardState = [];
    this.placedPieces = [];

    _initializeMatrix.call(this);
    _populateBoardSpaces.call(this);

    return boardState;

    /** Initializes the valid boundaries of the board */
    function _initializeMatrix() {
      // console.log("_initializeMatrix() called.");
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          row.push(null);
        }
        boardState.push(row);
      }
      // console.log("Matrix initialized.")
    }

    /** Adds board spaces to the board matrix */
    function _populateBoardSpaces() {
      // console.log("_populateBoardSpaces() called.")
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // console.log("attempting to set game board for xy:", y, x);
          boardState[y][x] = {
            player: null,
            validCoordSets: _populateValidCoordSets(y, x)
          };
        }
      }

      // console.log("Board spaces populated:", boardState);

      /** Accepts board coordinates and return array of valid coord sets */
      function _populateValidCoordSets(y, x) {
        // console.log("_populateValidCoordSets called with yx:", y, x);
        const vcs = [];
        let coordSet = [];

        /**
         * check each direction to see if a valid set of coords exist.
         * since we can't lookup column values for rows which are undefined,
         * we will check if the row exists before checking anything else
        */

        // does a row existing 4 rows above?
        if (boardState[y-3] !== undefined) {
          // check up and diagonals

          // check up
          if (boardState[y-3][x] !== undefined) {
            coordSet = [];
            coordSet.push([y, x]);
            coordSet.push([y-1, x]);
            coordSet.push([y-2, x]);
            coordSet.push([y-3, x]);
            vcs.push(coordSet);
          }

          // check upLeft
          if (boardState[y-3][x-3] !== undefined) {
            coordSet = [];
            coordSet.push([y, x]);
            coordSet.push([y-1, x-1]);
            coordSet.push([y-2, x-2]);
            coordSet.push([y-3, x-3]);
            vcs.push(coordSet);
          }

          // check upRight
          if (boardState[y-3][x+3] !== undefined) {
            coordSet = [];
            coordSet.push([y, x]);
            coordSet.push([y-1, x+1]);
            coordSet.push([y-2, x+2]);
            coordSet.push([y-3, x+3]);
            vcs.push(coordSet);
          }
        }

        // check left and right

        // check left
        if (boardState[y][x-3] !== undefined) {
          coordSet = [];
          coordSet.push([y, x]);
          coordSet.push([y, x-1]);
          coordSet.push([y, x-2]);
          coordSet.push([y, x-3]);
          vcs.push(coordSet);
        }

        // check right
        if (boardState[y][x+3] !== undefined) {
          coordSet = [];
          coordSet.push([y, x]);
          coordSet.push([y, x+1]);
          coordSet.push([y, x+2]);
          coordSet.push([y, x+3]);
          vcs.push(coordSet);
        }

        // console.log("Valid coord sets populated:", vcs)
        return vcs;
      }
    }
  }

  /**
   * Given a column, return the row lowest empty cell (has a null value)
   * If the column is full (has no null values), returns null
   */
  _findEmptyCellInColumn(col) {
    // console.log("attempting to find empty cell at col:", col);
    // check if the column is full and return 'null' if true
    if (this.board[0][col].player !== null) {
      // console.log("this col was full");
      return null;
    }

    let row = 0; // start at first row

    // loop through rows top to bottom until we either:
    // -- find a non-null cell (and return the slot above)
    // -- reach the last cell and return it
    while (row < this.height) {
      if (this.board[row][col].player !== null) {
        // console.log("found a piece at row, col", row, " ", col);
        // console.log("returning the row above:", row - 1);
        return row - 1;
      }
      row++;
    }
    return this.height - 1;
  }

  /** Adds the players numbers to the JS board where they dropped a piece */
  _addToBoard(y, x) {
    this.board[y][x].player = this.currPlayer;
    this.placedPieces.push([y, x]);
    // console.log("added to board");
  }

  /** End the game and announce results */
  _endGame(state) {
    this.gameState = state;
  }

  /** Checks for whether the game has ended and notifies the user if so */
  async _checkForGameEnd() {
    // console.log("checking for game end");

    // check if it's a win
    // check each placed piece
    for (let i = 0; i < this.placedPieces.length; i++) {
      const py = this.placedPieces[i][0];
      const px = this.placedPieces[i][1];
      // console.log("checking placed piece at xy", py, px);
      // check each valid coord set for this piece
      for (let j = 0; j < this.board[py][px].validCoordSets.length; j++) {
        const validCoordSets = this.board[py][px].validCoordSets[j];
        if (
          validCoordSets.every(
            c => {
              return (
                this.board[c[0]][c[1]].player !== null &&
                this.board[c[0]][c[1]].player.id === this.currPlayer.id)
            }
          )
        ) {
          // console.log("winner found")
          setTimeout(this._endGame(2), 10);
          this.winningSet = this.board[py][px].validCoordSets[j];
          return;
        }
      }
    }

    // check for tie
    if(this.board[0].every(cell => cell.player !== null)) {
      setTimeout(this._endGame(3), 10);
      return;
    }

    // switch players
    await this._updateCurrPlayer();
  }

  /** Switches to the next player */
  async _updateCurrPlayer(random) {
    // console.log("switching players")
    let wasAiPlayer = false;

    if (this.currPlayer instanceof AiPlayer) { wasAiPlayer = true; }

    if (random) {
      let totalPlayers = this.players.length;
      this.currPlayerIndex = Math.floor(Math.random() * totalPlayers);
      this.currPlayer = this.players[this.currPlayerIndex];
    } else if (this.currPlayerIndex >= this.players.length - 1) {
      this.currPlayerIndex = 0;
      this.currPlayer = this.players[0]
    } else {
      this.currPlayerIndex++;
      this.currPlayer = this.players[this.currPlayerIndex];
    }

    if (wasAiPlayer) { await this.aiCallback(); }

    // console.log("current player now:", this.currPlayer);

    if (this.currPlayer instanceof AiPlayer) {
      // console.log("ai player taking their turn");
      await this.currPlayer.takeTurn(this);
    }

    return;
  }
}

export { Player, AiPlayer, Game };


