import PropTypes from 'prop-types';
import { codeToCountry } from '../assets/countries';

function NewsContent({ newsData }) {
  return (
    <>
      <h1>{newsData.mainTitle + ' - ' + codeToCountry[newsData.country]}</h1>
      {newsData.items.map((item) => (
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

NewsContent.propTypes = {
  newsData: PropTypes.object
};

export default NewsContent;
