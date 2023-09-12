import { useEffect, useState } from 'react';
import createUrl from '../helpers/createUrl';
import parseXML from '../helpers/parseXML';
import { codeToCountry } from '../assets/countries';

export default function useNewsFetch({ country, topic }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState({ state: true, type: 'fetching' });
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (!country) {
        setLoading({ state: true, type: 'no-country' });
        return;
      }
      setLoading({ state: true, type: 'fetching' });
      try {
        if (!(country in codeToCountry)) {
          throw new Error('Country is not supported');
        }
        const url = createUrl(country, topic);
        const res = await fetch(url);
        if (res.status > 200) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        const xml = await res.text();
        const json = parseXML(xml);
        json.country = country;
        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading({ state: false, type: 'fetching' });
      }
    }

    fetchData();
  }, [country, topic]);

  return [data, loading, error];
}
