import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import nodeFetch from 'node-fetch';
import server from './testAssets/appMockServer';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import routesConfig from '../routesConfig';

global.fetch = nodeFetch;
global.Request = nodeFetch.Request;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Loads US Top News by default', async () => {
  const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  await screen.findByRole('heading', { name: 'US Top News - United States' });

  expect(
    screen.getByRole('heading', { name: 'US Top News - United States' })
  ).toBeInTheDocument();
});

it('Loads US Business News upon click on link', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  const businessLink = screen.getByRole('link', { name: 'Business' });
  await user.click(businessLink);

  await screen.findByRole('heading', {
    name: 'US Business News - United States'
  });

  expect(
    screen.getByRole('heading', { name: 'US Business News - United States' })
  ).toBeInTheDocument();
});

it('Switches country to GB upon select and loads corresponding news', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  const dropdown = screen.getByRole('combobox');
  await user.selectOptions(dropdown, 'United Kingdom');

  await screen.findByRole('heading', {
    name: 'GB Top News - United Kingdom'
  });

  expect(
    screen.getByRole('heading', { name: 'GB Top News - United Kingdom' })
  ).toBeInTheDocument();
});

it('Handles topic change and then country change', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  const businessLink = screen.getByRole('link', { name: 'Business' });
  const dropdown = screen.getByRole('combobox');

  await user.click(businessLink);
  await user.selectOptions(dropdown, 'United Kingdom');

  await screen.findByRole('heading', {
    name: 'GB Business News - United Kingdom'
  });

  expect(
    screen.getByRole('heading', { name: 'GB Business News - United Kingdom' })
  ).toBeInTheDocument();
});

it('Handles repeated changes of topic and country', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routesConfig, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  const businessLink = screen.getByRole('link', { name: 'Business' });
  const sportsLink = screen.getByRole('link', { name: 'Sports' });
  const dropdown = screen.getByRole('combobox');

  await user.selectOptions(dropdown, 'United Kingdom');
  await user.click(businessLink);
  await user.selectOptions(dropdown, 'United States');
  await user.click(sportsLink);

  await screen.findByRole('heading', {
    name: 'US Sports News - United States'
  });

  expect(
    screen.getByRole('heading', { name: 'US Sports News - United States' })
  ).toBeInTheDocument();
});

it('Updates country using the IP to Country feature', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(routesConfig, {
    initialEntries: ['/topics/business?country=GB']
  });
  render(<RouterProvider router={router} />);

  const textbox = screen.getByRole('textbox');
  const checkIpBtn = screen.getByRole('button', { name: 'Check IP' });

  await user.type(textbox, '135.250.43.126');
  await user.click(checkIpBtn);

  await screen.findByRole('button', {
    name: 'Update country to United States'
  });

  const updateBtn = screen.getByRole('button', {
    name: 'Update country to United States'
  });

  await user.click(updateBtn);

  await screen.findByRole('heading', {
    name: 'US Business News - United States'
  });

  expect(
    screen.getByRole('heading', { name: 'US Business News - United States' })
  ).toBeInTheDocument();
});
