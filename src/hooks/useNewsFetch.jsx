import { useEffect, useState } from 'react';
import createUrl from '../helpers/createUrl';

export default function useNewsFetch({ country, topic }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (!country) return;
      setLoading(true);
      try {
        const url = createUrl(country, topic);
        const res = await fetch(url);
        const xml = await res.text();
        const tree = new DOMParser().parseFromString(xml, 'text/xml');
        const mainTitle = tree.querySelector('channel title').textContent;
        const items = Array.from(tree.querySelectorAll('item')).map((i) => {
          const title = i.querySelector('title').textContent;
          const link = i.querySelector('link').textContent;
          return { title, link };
        });
        setData({ country, mainTitle, items });
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [country, topic]);

  return [data, loading, error];
}
