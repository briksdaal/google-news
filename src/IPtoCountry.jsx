import { useEffect, useState } from 'react';
import useGetCountryFromIp from './hooks/useGetCountryFromIp';
import { codeToCountry } from './assets/countries';

export default function IPtoCountry({ setCountry }) {
  const [inputIp, setInputIp] = useState('');
  const [newTyping, setNewTyping] = useState(true);
  const [ipToLookup, setIpToLookup] = useState('');
  const [data, loading, error] = useGetCountryFromIp({ ip: ipToLookup });

  useEffect(() => {
    setInputIp(data?.IPv4 ? data.IPv4 : '');
    setNewTyping(false);
  }, [data]);

  function handleIPLookupSubmit(e) {
    e.preventDefault();
    setIpToLookup(inputIp);
  }

  function handleCountryChange(e) {
    e.preventDefault();
    setCountry(data.country_code);
  }

  return (
    <>
      <form onSubmit={handleIPLookupSubmit}>
        <label>
          Country by IP:{' '}
          <input
            type="tel"
            value={inputIp}
            onChange={(e) => {
              setInputIp(e.target.value);
              if (!newTyping && e.target.value !== ipToLookup)
                setNewTyping(true);
            }}
          />
        </label>
        {error ? (
          <p>Please try disabling your adblocker for Country By IP</p>
        ) : (
          <button type="submit">Check IP</button>
        )}
      </form>
      {loading && <p>Checking...</p>}
      {!loading && !newTyping && data && (
        <form onSubmit={handleCountryChange}>
          {data.country_code === null ? (
            <p>{data.IPv4} does not seem to be of any country</p>
          ) : data.country_code in codeToCountry ? (
            <>
              <p>
                {ipToLookup.length === 0 && 'Your'} IP address {data.IPv4} seems
                to be from {data.country_name}
              </p>
              <button type="submit">
                Update country to {data.country_name}
              </button>
            </>
          ) : (
            <p>
              Google news in {data?.country_name} is not available in English
            </p>
          )}
        </form>
      )}
    </>
  );
}
