import React from 'react';
import { render } from '@testing-library/react';
import PlayerManager from './PlayerManager';
import PlayerList from './PlayerList'
import AddPlayerForm from './AddPlayerForm';

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

jest.mock('./PlayerList');
jest.mock('./AddPlayerForm');

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
function add() {};

test('PlayerManager renders without crashing when passed valid props', () => {

  const { container } = render(
    <PlayerManager add={add} players={players} remove={remove} />
  );

  expect(container.querySelector(".PlayerManager")).not.toBeNull();
  expect(container.querySelector(".PlayerListTitle")).not.toBeNull();
  expect(container.querySelector(".AddPlayerFormTitle")).not.toBeNull();

});

test('PlayerManager passes correct params to child components', () => {

  render(<PlayerManager add={add} players={players} remove={remove} />);

  expect(PlayerList).toHaveBeenCalledWith({
    remove: remove,
    players: players
  }, expect.anything()) // expect.anything() accounts for {} passed in all React calls

  expect(AddPlayerForm).toHaveBeenCalledWith({
    add: add
  }, expect.anything()) // expect.anything() accounts for {} passed in all React calls
});
