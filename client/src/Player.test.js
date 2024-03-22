import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Player from './Player'

/**
 * Props:
 *  - playerId: The ID of the player
 *  - playerName: The name of the player
 *  - playerColor: The color of the player
 *  - remove(): A callback function for when a 'remove' button is clicked
 *
 * State:
 *  - None
 *
 * PlayerList -> Player */

let removeCalled = false;

function remove() {
  removeCalled = true;
};

test('Player renders without crashing when passed valid params', () => {
  const { container } = render(
    <Player
      playerId={1234}
      playerName={'foobar'}
      playerColor={'#4c44c4'}
      remove={remove}
    />
  );

  expect(container.querySelector(".Player")).not.toBeNull;
});

test('Player renders appropriate player data', () => {
  const { container } = render(
    <Player
      playerId={1234}
      playerName={'foobar'}
      playerColor={'#4c44c4'}
      remove={remove}
    />
  );

  let playerName = container.querySelector(".Player-name");
  expect(playerName).toHaveTextContent('foobar');

  let playerColorCircle = container.querySelector(".Player-colorCircle");
  expect(playerColorCircle).toHaveStyle({
    backgroundColor: '#4c44c4'
  });
});

test('Player handles remove click and calls remove()', () => {
  const { container } = render(
    <Player
      playerId={1234}
      playerName={'foobar'}
      playerColor={'#4c44c4'}
      remove={remove}
    />
  );

  let button = container.querySelector(".Player-removeButton");
  fireEvent.click(button);
  expect(removeCalled).toBe(true);
});