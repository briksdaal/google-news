import topics from '../assets/topics';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function Nav({ country = 'US' }) {
  return (
    <nav>
      {topics.list.map((t) => (
        <li key={t.name}>
          <NavLink
            to={
              t.value.length
                ? `/topics/${t.name.toLowerCase()}?country=${country}`
                : `/?country=${country}`
            }>
            {t.name}
          </NavLink>
        </li>
      ))}
    </nav>
  );
}

Nav.propTypes = {
  country: PropTypes.string
};

export default Nav;
