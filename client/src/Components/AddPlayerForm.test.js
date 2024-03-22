import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddPlayerForm from './AddPlayerForm'

/**
 * Props:
 *  - add(): A callback function for when a player is added by a user
 *
 * State:
 *  - None
 *
 * PlayerManager -> AddPlayerForm*/

let addCalled = false;

function add() {
  addCalled = true;
};

test('AddPlayerForm renders without crashing when passed valid params', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  expect(container.querySelector(".AddPlayerForm")).not.toBeNull;
});

test('AddPlayerForm renders all expected form elements', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  expect(container.querySelector("#addPlayerForm-playerName")).not.toBeNull();
  expect(container.querySelector("#addPlayerForm-color")).not.toBeNull();
  expect(container.querySelector("#addPlayerForm-ai")).not.toBeNull();
  expect(container.querySelector(".AddPlayerForm-button")).not.toBeNull();
});

test('AddPlayerForm handles form submit and calls add()', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  let button = container.querySelector(".AddPlayerForm-button");
  fireEvent.click(button);
  expect(addCalled).toBe(true);
});

test('AddPlayerForm handles changing player name', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  let playerNameEntry = container.querySelector("#addPlayerForm-playerName")
  fireEvent.change(playerNameEntry, { target: { value: 'a' } });
  expect(playerNameEntry.value).toBe('a');
});

test('AddPlayerForm handles changing player color', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  let playerColorPicker = container.querySelector("#addPlayerForm-color")
  fireEvent.change(playerColorPicker, { target: { value: '#c51343' } });
  expect(playerColorPicker.value).toBe('#c51343');
});

test('AddPlayerForm handles changing player type', () => {
  const { container } = render(
    <AddPlayerForm add={add} />
  );

  let playerTypeCheckBox = container.querySelector("#addPlayerForm-ai")
  fireEvent.click(playerTypeCheckBox);
  expect(playerTypeCheckBox.checked).toBe(true);
});
