import { render, screen } from '@testing-library/react';
import NewsContent from '../components/NewsContent';
import { codeToCountry } from '../assets/countries';
import { expect } from 'vitest';

const testData = {
  mainTitle: 'Top stories - Google News',
  items: [
    {
      title:
        'Morocco survivors seek aid as earthquake toll passes 2100 - Reuters',
      link: 'https://news.google.com/rss/articles/CBMiamh0dHBzOi8vd3d3LnJldXRlcnMuY29tL3dvcmxkL2FmcmljYS9yZXNjdWVycy1odW50LXN1cnZpdm9ycy1tb3JvY2NvLXF1YWtlLXdpdGgtb3Zlci0yMDAwLWRlYWQtMjAyMy0wOS0xMC_SAQA?oc=5'
    },
    {
      title:
        'White House press secretary ends news conference as Biden is still responding to questions from reporters - CNN',
      link: 'https://news.google.com/rss/articles/CBMiYGh0dHBzOi8vd3d3LmNubi5jb20vMjAyMy8wOS8xMC9wb2xpdGljcy9rYXJpbmUtamVhbi1waWVycmUtam9lLWJpZGVuLXByZXNzLWNvbmZlcmVuY2UvaW5kZXguaHRtbNIBZGh0dHBzOi8vYW1wLmNubi5jb20vY25uLzIwMjMvMDkvMTAvcG9saXRpY3Mva2FyaW5lLWplYW4tcGllcnJlLWpvZS1iaWRlbi1wcmVzcy1jb25mZXJlbmNlL2luZGV4Lmh0bWw?oc=5'
    },
    {
      title:
        'Convicted killer who escaped Pennsylvania prison spotted more than 20 miles from search area and changed his appearance, police say - CNN',
      link: 'https://news.google.com/rss/articles/CBMiYGh0dHBzOi8vd3d3LmNubi5jb20vMjAyMy8wOS8xMC91cy9kYW5lbG8tY2F2YWxjYW50ZS1pbm1hdGUtc2VhcmNoLXBlbm5zeWx2YW5pYS1zdW5kYXkvaW5kZXguaHRtbNIBZGh0dHBzOi8vYW1wLmNubi5jb20vY25uLzIwMjMvMDkvMTAvdXMvZGFuZWxvLWNhdmFsY2FudGUtaW5tYXRlLXNlYXJjaC1wZW5uc3lsdmFuaWEtc3VuZGF5L2luZGV4Lmh0bWw?oc=5'
    },
    {
      title:
        'New Mexico Governor Issues 30-Day Ban on Carrying Guns in Public in Albuquerque - The New York Times',
      link: 'https://news.google.com/rss/articles/CBMiSmh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMjMvMDkvMDkvdXMvZ3Vucy1iYW4tbmV3LW1leGljby1hbGJ1cXVlcnF1ZS5odG1s0gEA?oc=5'
    }
  ],
  country: 'US'
};

it('Renders title in a heading', () => {
  render(<NewsContent newsData={testData} />);

  expect(
    screen.getByRole('heading', {
      name: `${testData.mainTitle} - ${codeToCountry[testData.country]}`
    })
  ).toBeInTheDocument();
});

it('Renders items in data as links', () => {
  render(<NewsContent newsData={testData} />);

  const links = screen.getAllByRole('link');

  expect(links).toHaveLength(testData.items.length);

  links.forEach((link, i) => {
    expect(link).toHaveTextContent(testData.items[i].title);
    expect(link).toHaveAttribute('href', testData.items[i].link);
  });
});
