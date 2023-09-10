import { useParams, useSearchParams } from 'react-router-dom';
import useNewsFetch from '../hooks/useNewsFetch';
import NewsContent from './NewsContent';

function FetchNews() {
  const [searchParams] = useSearchParams();
  const { topicId: topic } = useParams();
  const country = searchParams.get('country');

  const [data, loading, error] = useNewsFetch({ country, topic });

  if (loading.state) return <h1 data-testid={loading.type}>Loading...</h1>;

  if (error) return <h1>{error.toString()}</h1>;

  return <NewsContent newsData={data} />;
}

export default FetchNews;
