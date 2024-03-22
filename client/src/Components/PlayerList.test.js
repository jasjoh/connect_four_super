import React from 'react';
import { render } from '@testing-library/react';
import PlayerList from './PlayerList'
import Player from './Player';

/** Displays the list of players added to the game
 *
 * Props:
 *  - players: An array of player objects { name, color, id, ai }
 *  - remove(): A callback function for when a 'remove' button is clicked
 *
 * State:
 *  - None
 *
 * PlayerManager -> PlayerList -> Player */

jest.mock('./Player');

let players = [
  {
    id: '1234',
    color: '#22c3c3',
    name: 'foo'
  }, {
    id: '5678',
    color: '#d445d4',
    name: 'bar'
  }
]

function remove() {};

test('PlayerList renders without crashing when passed valid props', () => {

  const { container } = render(
    <PlayerList players={players} remove={remove} />
  );

  const playerListDiv = container.querySelector("div");
  expect(playerListDiv).toHaveClass('PlayerList');
});

test('PlayerList passes correct params to correct # child components', () => {

  render(<PlayerList players={players} remove={remove} />);

  expect(Player).toHaveBeenCalledTimes(2);

  expect(Player).toHaveBeenCalledWith({
    remove: remove,
    playerId: players[0].id,
    playerName: players[0].name,
    playerColor: players[0].color
  }, expect.anything()) // expect.anything() accounts for {} passed in all React calls
});
