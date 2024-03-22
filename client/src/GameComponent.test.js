import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GameComponent from './GameComponent'
import GameBoard from './GameBoard';
import { createMockGame, createBoardState } from './testHelpers';

/** Displays the game area with the start / restart button and game board
 *
 * Props:
 * - game: The game instance to render
 * - dropPiece(): A callback function for when a piece is dropped
 * - startGame(): A callback function to start / restart a game
 *
 * State:
 * - None
 *
 * Logic:
 * - Handles button clicks to call startGame()
 * - Checks if game.players.length < 2 and renders empty <div> if so
 * - Display start button if game.gameState === 0; restart otherwise
 *
 * Renders
 * - Start / Restart Button
 * - Current Player
 * - GameBoard (passing game.board and dropPiece())
 *
 * Main -> GameComponent -> GameBoard */

let boardState = createBoardState();
let game = createMockGame(boardState);
let returnedColIndex = 0;
let startGameCalled = false;

// mock dropPiece() function; sets the 'returnColIndex' test param to the passed in index
function dropPiece(colIndex) {
  returnedColIndex = colIndex;
}

// mock startGame() function; sets the 'startGameCalled' test param to 'true'
function startGame() {
  startGameCalled = true;
}

// mock the child GameBoard component
jest.mock('./GameBoard')

// resets testing parameters
beforeEach(() => {
  returnedColIndex = 0;
  startGameCalled = false;
})

/* TESTING CLASS MATCHING CAPABILITY

class FooTest {
  constructor(bar) {
    this.bar = bar;
  }
}

class BarTest {
  constructor(foo) {
    this.foo = foo;
  }
}

let foo = new FooTest('happy');

jest.mock('./GameComponent');

test('Class matching capability', () => {

  render(<GameComponent game={foo} dropPiece={dropPiece} startGame={startGame}/>)

  expect(GameComponent).toHaveBeenCalledWith({
    game: expect.any(FooTest),
    dropPiece: dropPiece,
    startGame: startGame
  }, expect.anything()) // expect.anything() accounts for {} passed in all React calls
});

*/

test('GameComponent component renders without crashing when passed valid params', () => {
  // default game has player count of 0 and gameState of 0
  // only empty div should be rendered

  const { container } = render(
    <GameComponent game={game} dropPiece={dropPiece} startGame={startGame}/>
  );

  const gameDiv = container.querySelector("div");
  expect(gameDiv).toHaveClass('GameComponent');

  expect(container.querySelector(".GameComponent-button")).toBeNull();
  expect(container.querySelector(".GameComponent-currentPlayer")).toBeNull();

  expect(GameBoard).not.toHaveBeenCalled();
});

test('GameComponent component passes correct params to GameBoard', () => {
  game.players = [1,2];
  game.gameState = 1;

  render(<GameComponent game={game} dropPiece={dropPiece} startGame={startGame}/>)

  expect(GameBoard).toHaveBeenCalled();
  // we could also use expect.objectContaining({ key: value }) instead of literal
  expect(GameBoard).toHaveBeenCalledWith({
    dropPiece: dropPiece,
    boardState: game.board
  }, expect.anything()) // expect.anything() accounts for {} passed in all React calls
});

test('GameComponent component renders Start Game but not game board when 2+ players and game not started', () => {
  game.players = [1,2];
  game.gameState = 0;

  const { container } = render(
    <GameComponent game={game} dropPiece={dropPiece} startGame={startGame}/>
  );

  const gameDiv = container.querySelector("div");
  expect(gameDiv).toHaveClass('GameComponent');

  expect(container.querySelector(".GameComponent-button")).not.toBeNull();
  expect(container.querySelector(".GameComponent-currentPlayer")).toBeNull();

  const button = container.querySelector(".GameComponent-button");
  expect(button).toHaveTextContent('Start Game');

  expect(GameBoard).not.toHaveBeenCalled();
});

test('GameComponent component renders Restart Game and game board when 2+ players and game is started', () => {
  game.players = [1,2];
  game.gameState = 1;

  const { container } = render(
    <GameComponent game={game} dropPiece={dropPiece} startGame={startGame}/>
  );

  const gameDiv = container.querySelector("div");
  expect(gameDiv).toHaveClass('GameComponent');

  expect(container.querySelector(".GameComponent-button")).not.toBeNull();
  expect(container.querySelector(".GameComponent-currentPlayer")).not.toBeNull();

  const button = container.querySelector(".GameComponent-button");
  expect(button).toHaveTextContent('Restart Game');

  expect(GameBoard).toHaveBeenCalled();
});

test('GameComponent handles button click and calls startGame() callback', () => {
  game.players = [1,2];
  game.gameState = 1;

  const { container } = render(
    <GameComponent game={game} dropPiece={dropPiece} startGame={startGame}/>
  );

  const button = container.querySelector(".GameComponent-button");
  fireEvent.click(button);
  expect(startGameCalled).toBe(true);
});