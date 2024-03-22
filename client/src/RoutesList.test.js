import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoutesList from './RoutesList';

test('renders Main component for / route', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      <RoutesList />
    </MemoryRouter>
  );
  const playerTitle = container.querySelector(".PlayerListTitle");
  expect(playerTitle.textContent).toEqual("Current Players (Minimum Two)");
});

test('redirects to Main for unknown routes', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/unknown']}>
      <RoutesList />
    </MemoryRouter>
  );
  const playerTitle = container.querySelector(".PlayerListTitle");
  expect(playerTitle.textContent).toEqual("Current Players (Minimum Two)");
});