import PropTypes from 'prop-types';
import { codeToCountry } from '../assets/countries';

function NewsContent({ data }) {
  return (
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

NewsContent.propTypes = {
  data: PropTypes.object
};

export default NewsContent;
