import { useState } from 'react';
import Dropdown from './Dropdown';
import IPtoCountry from './IPtoCountry';
import useNewsFetch from './hooks/useNewsFetch';
import topics from './assets/topics';
import countries, { codeToCountry } from './assets/countries';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
  const [country, setCountry] = useState('US');
  const { topicId: topic } = useParams();
  const [data, loading, error] = useNewsFetch({
    country,
    topic
  });
  let content = '';

  function handleCountryChange(country_code) {
    setCountry(country_code);
  }

  if (loading) content = <h1>Loading...</h1>;
  else if (error) {
    content = (
      <h1>
        {error.content
          ? 'Error ' + error.content
          : `Error fetching - Google News might not be availabe in English in ${country}`}
      </h1>
    );
  } else {
    content = (
      <>
        <h1>{data.mainTitle + ' - ' + codeToCountry[data.country]}</h1>
        {data.items.map((item) => (
          <li key={item.title}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      <h1>Google News Clone</h1>
      <nav>
        {topics.list.map((t) => (
          <li key={t.name}>
            <Link to={t.value.length ? `/topics/${t.name.toLowerCase()}` : '/'}>
              {t.name}
            </Link>
          </li>
        ))}
      </nav>
      <Dropdown
        selected={country}
        handleChange={handleCountryChange}
        object={countries}
      />
      <IPtoCountry setCountry={setCountry} />
      {content}
    </>
  );
}

export default App;
