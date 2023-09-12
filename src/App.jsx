import { useEffect } from 'react';
import Nav from './components/Nav';
import Dropdown from './components/Dropdown';
import IPtoCountry from './components/IPtoCountry';
import countries from './assets/countries';
import { useSearchParams, Outlet } from 'react-router-dom';

export default function App2() {
  const [searchParams, setSearchParams] = useSearchParams();

  const country = searchParams.get('country') || '';

  useEffect(() => {
    if (!searchParams.get('country')) {
      setSearchParams({ country: 'US' });
    }
  }, [searchParams, setSearchParams]);

  function handleCountryChange(country_code) {
    setSearchParams({ country: country_code });
  }

  return (
    <>
      <h1>Google News Clone</h1>
      <Nav country={country} />
      <section>
        <Dropdown
          selected={country}
          handleChange={handleCountryChange}
          dropdownData={countries}
        />
        <IPtoCountry handleCountryChange={handleCountryChange} />
      </section>
      <Outlet context={country} />
    </>
  );
}
