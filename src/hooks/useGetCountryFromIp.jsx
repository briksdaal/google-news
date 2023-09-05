import { useEffect, useState } from 'react';

export default function useGetCountryFromIp({ ip }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (ip === '') return;
      setLoading(true);
      try {
        const res = await fetch('/geo/' + ip);
        if (res.status > 200) throw new Error('Code ' + res.status);
        let json = await res.json();
        if (json.IPv4 === 'Not found') {
          json.IPv4 = ip;
          json.country_code = null;
        }
        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [ip]);

  return [data, loading, error];
}
