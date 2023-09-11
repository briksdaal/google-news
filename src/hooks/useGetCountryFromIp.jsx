import { useEffect, useState } from 'react';

export default function useGetCountryFromIp(ipObj) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const ip = ipObj.ip;
    async function fetchData() {
      if (ip === '') return;
      setLoading(true);
      try {
        const res = await fetch('/geo/' + ip);
        if (res.status > 200)
          throw new Error(`${res.status}: ${res.statusText}`);
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
  }, [ipObj]);

  return [data, loading, error];
}
