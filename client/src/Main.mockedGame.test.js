import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import Main from './Main';
import GameComponent from './GameComponent';
import PlayerManager from './PlayerManager';
import { Game, AiPlayer, Player } from './models';

/**
 * This file tests the logic inside the Main component that is not dependent
 * upon having access to non-method properties of the Game instance which
 * Main creates. It is supplemented by the tests in Main.realGame.test.js.
 */

jest.mock('./GameComponent');
jest.mock('./PlayerManager');
jest.mock('./models');

test('Main component renders without crashing', () => {
  // default game has player count of 0 and gameState of 0
  // only empty div should be rendered

  const { container } = render(
    <Main />
  );

  const mainDiv = container.querySelector("div");
  expect(mainDiv).toHaveClass('Main');
});

test('Main component renders and in turn renders child components', () => {

  render(<Main />);

  expect(GameComponent).toHaveBeenCalled();
  expect(PlayerManager).toHaveBeenCalled();
});

test('Main component renders, initializing a game instance and passes it to GameComponent', () => {

  render(<Main />);

  expect(GameComponent).toHaveBeenCalledWith({
    game: expect.any(Game),
    dropPiece: expect.any(Function),
    startGame: expect.any(Function)
  }, expect.anything())
});

test('Main component handles dropPiece() calls and re-renders', () => {

  render(<Main />);

  // grab the aiCallback() function that Main provided
  const dropPiece = GameComponent.mock.calls[0][0].dropPiece;
  const game = GameComponent.mock.calls[0][0].game;
  const dropPieceSpy = jest.spyOn(game, 'dropPiece');

  // track how many times Main has rendered by counting mock Game calls
  const priorGameComponentCalls = GameComponent.mock.calls.length;
  console.log("GameComponent calls", GameComponent.mock.calls.length);

  // call dropPiece() with colIndex 2
  act(() => {
    dropPiece(2);
  });

  expect(dropPieceSpy).toHaveBeenCalledTimes(1);
  expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 1);
});

test('Main component handles addPlayer() calls and re-renders', () => {

  render(<Main />);

  // grab the aiCallback() function that Main provided
  const mainAddPlayer = PlayerManager.mock.calls[0][0].add;
  const game = GameComponent.mock.calls[0][0].game;
  const gameAddPlayerSpy = jest.spyOn(game, 'addPlayer');

  // track how many times Main has rendered by counting mock Game calls
  const priorGameComponentCalls = GameComponent.mock.calls.length;
  console.log("GameComponent calls", GameComponent.mock.calls.length);

  const aiFormData = {
    ai: true,
    color: '#c3c3c3',
    playerName: 'foo'
  }

  const humanFormData = {
    ai: false,
    color: '#c3c3c3',
    playerName: 'foo'
  }

  act(() => {
    mainAddPlayer(aiFormData);
  });

  expect(gameAddPlayerSpy).toHaveBeenCalledTimes(1);
  expect(gameAddPlayerSpy).toHaveBeenCalledWith(expect.any(AiPlayer));
  expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 1);

  gameAddPlayerSpy.mockClear();

  act(() => {
    mainAddPlayer(humanFormData);
  });

  expect(gameAddPlayerSpy).toHaveBeenCalledTimes(1);
  expect(gameAddPlayerSpy).not.toHaveBeenCalledWith(expect.any(AiPlayer));
  expect(gameAddPlayerSpy).toHaveBeenCalledWith(expect.any(Player));
  expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 2);
});

test('Main component handles removePlayer() calls and re-renders', () => {

  render(<Main />);

  // grab the aiCallback() function that Main provided
  const mainRemovePlayer = PlayerManager.mock.calls[0][0].remove;
  const game = GameComponent.mock.calls[0][0].game;
  const gameRemovePlayerSpy = jest.spyOn(game, 'removePlayer');

  // track how many times Main has rendered by counting mock Game calls
  const priorGameComponentCalls = GameComponent.mock.calls.length;
  console.log("GameComponent calls", GameComponent.mock.calls.length);

  act(() => {
    mainRemovePlayer('1234');
  });

  expect(gameRemovePlayerSpy).toHaveBeenCalledTimes(1);
  expect(gameRemovePlayerSpy).toHaveBeenCalledWith('1234');
  expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 1);
});

test('Main component handles startGame() calls and re-renders', async () => {

  render(<Main />);

  // grab the aiCallback() function that Main provided
  const mainAddPlayer = PlayerManager.mock.calls[0][0].add;
  const mainStartGame = GameComponent.mock.calls[0][0].startGame;
  const game = GameComponent.mock.calls[0][0].game;
  const gameStartGameSpy = jest.spyOn(game, 'startGame');

  // track how many times Main has rendered by counting mock Game calls
  const priorGameComponentCalls = GameComponent.mock.calls.length;
  console.log("GameComponent calls", GameComponent.mock.calls.length);

  act(() => {
    mainAddPlayer({
      ai: false,
      color: '#c3c3c3',
      playerName: 'foo'
    });
  });

  act(() => {
    mainAddPlayer({
      ai: false,
      color: '#c3c3c3',
      playerName: 'bar'
    });
  });

  act(() => {
    mainStartGame();
  });

  await waitFor(() => {
    expect(gameStartGameSpy).toHaveBeenCalledTimes(1);
    expect(GameComponent.mock.calls.length).toBe(priorGameComponentCalls + 3);
  })
});