import { useParams, useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';
import useNewsFetch from '../hooks/useNewsFetch';
import NewsContent from './NewsContent';

function FetchNews() {
  const country = useOutletContext();
  const { topicId: topic } = useParams();

  const [data, loading, error] = useNewsFetch({ country, topic });

  if (loading.state) return <h1 data-testid={loading.type}>Loading...</h1>;

  if (error) return <h1>{error.toString()}</h1>;

  return <NewsContent newsData={data} />;
}

FetchNews.propTypes = {
  country: PropTypes.string
};

export default FetchNews;
