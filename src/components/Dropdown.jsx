import PropTypes from 'prop-types';
import { codeToCountry } from '../assets/countries';

function Dropdown({ selected, handleChange, dropdownData }) {
  const computedSelect = selected && selected in codeToCountry ? selected : '';

  return (
    <form>
      <label>
        {dropdownData.label}
        {': '}
        <select
          value={computedSelect}
          onChange={(e) => handleChange(e.target.value)}>
          <option
            value=""
            disabled>
            Select a country
          </option>
          {dropdownData.list.map((t) => (
            <option
              key={t.name}
              value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}

Dropdown.propTypes = {
  selected: PropTypes.string,
  handleChange: PropTypes.func,
  dropdownData: PropTypes.object
};

export default Dropdown;
