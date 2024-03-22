import React from 'react';
import { render, act } from '@testing-library/react';
import Main from './Main';
import GameComponent from './GameComponent';

/**
 * These tests for Main rely on access to properties in the Game instance
 * that Main creates. Since class mocks don't preserve or allow access to
 * these properties, this file maintains those tests which do require it.
 */

jest.mock('./GameComponent');

test('Main component listens for aiCallback() and re-renders', () => {

  render(<Main />);

  // console.log('Game.mock.instances', Game.mock.instances);

  // grab the aiCallback() function that Main provided
  const aiCallback = GameComponent.mock.calls[0][0].game.aiCallback

  // track how many times Main has rendered by counting mock Game calls
  const priorGameComponentCalls = GameComponent.mock.calls.length;
  console.log("GameComponent calls", GameComponent.mock.calls.length);

  // call the aiCallback()
  act(() => {
    aiCallback();
    // Game.mock.instances[0].aiCallback(); <-- doesn't work
  });

  expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 1);
});


test('Main component adds board highlights and displays winner name', () => {

  const { container } = render(<Main />);

  const game = GameComponent.mock.calls[0][0].game;
  game.currPlayer = { name: 'foobar' };
  game.gameState = 2;
  game.winningSet = [
    [0,1],
    [0,2]
  ]
  // console.log('game', game);

  // call aiCallback() to trigger a re-rendering once state is changed
  const aiCallback = GameComponent.mock.calls[0][0].game.aiCallback
  act(() => {
    aiCallback();
  });

  expect(game.board[0][1].highlight).toBe(true);
  expect(game.board[0][2].highlight).toBe(true);
  expect(game.board[0][3].highlight).toBeUndefined;

  let alertDiv = container.querySelector(".Main-alert");
  expect(alertDiv).toHaveTextContent('foobar has won the game!');

});

test('Main component displays tie alert', () => {

  const { container } = render(<Main />);

  const game = GameComponent.mock.calls[0][0].game;
  game.currPlayer = { name: 'foobar' };
  game.gameState = 3;

  // call aiCallback() to trigger a re-rendering once state is changed
  const aiCallback = GameComponent.mock.calls[0][0].game.aiCallback
  act(() => {
    aiCallback();
  });

  let alertDiv = container.querySelector(".Main-alert");
  expect(alertDiv).toHaveTextContent('Game is tied!');

});

