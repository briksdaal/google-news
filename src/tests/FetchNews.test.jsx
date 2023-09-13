import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { vi } from 'vitest';
import FetchNews from '../components/FetchNews';
import { BrowserRouter } from 'react-router-dom';
import { useParams, useOutletContext } from 'react-router-dom';
import nodeFetch from 'node-fetch';

global.fetch = nodeFetch;
global.Request = nodeFetch.Request;

vi.mock('../components/NewsContent', () => ({
  default: ({ newsData }) => <h2>{newsData.mainTitle}</h2>
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useOutletContext: vi.fn()
  };
});

const usTopNewsXML = `
<channel>
  <title>English Top News</title>
</channel>
    `;

const gbBusinessXML = `
    <channel>
      <title>United Kingdom Business News</title>
    </channel>
        `;

const server = setupServer(
  ...[
    rest.get('/api', (req, res, ctx) => {
      const hl = req.url.searchParams.get('hl');
      const gl = req.url.searchParams.get('gl');
      const ceid = req.url.searchParams.get('ceid');
      if (hl === 'en-US' && gl === 'US' && ceid === 'US:en')
        return res(ctx.xml(usTopNewsXML));
    }),
    rest.get('/api/topics/business', (req, res, ctx) => {
      const hl = req.url.searchParams.get('hl');
      const gl = req.url.searchParams.get('gl');
      const ceid = req.url.searchParams.get('ceid');
      if (hl === 'en-GB' && gl === 'GB' && ceid === 'GB:en')
        return res(ctx.xml(gbBusinessXML));
    })
  ]
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders loading at first', () => {
  useParams.mockImplementation(() => ({}));
  render(<FetchNews country={'US'} />, { wrapper: BrowserRouter });

  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'English Top News' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('error', { exact: false })).not.toBeInTheDocument();
});

it('Renders english top news if country serach param is US and topic is null', async () => {
  useParams.mockImplementation(() => ({}));
  useOutletContext.mockImplementation(() => 'US');
  render(<FetchNews />, { wrapper: BrowserRouter });

  await screen.findByRole('heading', { name: 'English Top News' });

  expect(
    screen.getByRole('heading', { name: 'English Top News' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Loading...' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('error', { exact: false })).not.toBeInTheDocument();
});

it('Renders topic news in chosen language if both country and topic are provided', async () => {
  useParams.mockImplementation(() => ({ topicId: 'business' }));
  useOutletContext.mockImplementation(() => 'GB');
  render(<FetchNews />, { wrapper: BrowserRouter });

  await screen.findByRole('heading', { name: 'United Kingdom Business News' });

  expect(
    screen.queryByRole('heading', { name: 'Loading...' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('error', { exact: false })).not.toBeInTheDocument();
});

it("Continues to render loading if search params don't contain country", async () => {
  useParams.mockImplementation(() => ({}));
  useOutletContext.mockImplementation(() => '');
  render(<FetchNews />, { wrapper: BrowserRouter });

  await screen.findByTestId('no-country');

  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'English Top News' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('error', { exact: false })).not.toBeInTheDocument();
});

it('Shows an error message if country is not supported', async () => {
  useOutletContext.mockImplementation(() => 'AA');
  server.use(
    rest.get('/api', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(<FetchNews />, { wrapper: BrowserRouter });

  await screen.findByText('Error: country is not supported', { exact: false });

  expect(
    screen.getByText('Error: country is not supported', { exact: false })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'English Top News' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Loading...' })
  ).not.toBeInTheDocument();
});

it('Shows an error message if an error is thrown', async () => {
  useOutletContext.mockImplementation(() => 'US');
  server.use(
    rest.get('/api', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(<FetchNews />, { wrapper: BrowserRouter });

  await screen.findByText('error', { exact: false });

  expect(screen.getByText('error', { exact: false })).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'English Top News' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Loading...' })
  ).not.toBeInTheDocument();
});
