import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import topics from '../assets/topics';
import Nav from '../components/Nav';
vi.mock('../assets/topics', () => ({
  default: {
    list: [
      {
        name: 'topic1',
        value: ''
      },
      {
        name: 'topic2',
        value: '222'
      },
      {
        name: 'topic3',
        value: '333'
      },
      {
        name: 'topic4',
        value: '444'
      }
    ]
  }
}));

it('Renders topics as nav items', () => {
  render(<Nav />, { wrapper: BrowserRouter });

  expect(
    within(screen.getByRole('navigation')).getAllByRole('listitem')
  ).toHaveLength(topics.list.length);
});

it('Creates main link (empty value) correctly', () => {
  render(<Nav />, { wrapper: BrowserRouter });

  const navitems = within(screen.getByRole('navigation')).getAllByRole(
    'listitem'
  );

  const mainLink = within(navitems[0]).getByRole('link');

  expect(mainLink).toHaveTextContent(topics.list[0].name);
  expect(mainLink).toHaveAttribute('href', `/?country=US`);
});

it('Creates topic links (non-empty value) correctly', () => {
  render(<Nav />, { wrapper: BrowserRouter });

  const navitems = within(screen.getByRole('navigation')).getAllByRole(
    'listitem'
  );

  navitems.forEach((item, i) => {
    if (i === 0) return;
    const link = within(item).getByRole('link');
    expect(link).toHaveTextContent(topics.list[i].name);
    expect(link).toHaveAttribute(
      'href',
      `/topics/${topics.list[i].name}?country=US`
    );
  });
});
