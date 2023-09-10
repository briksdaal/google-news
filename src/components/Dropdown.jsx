import PropTypes from 'prop-types';

function Dropdown({ selected = '', handleChange, dropdownData }) {
  return (
    <form>
      <label>
        {dropdownData.label}
        {': '}
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}>
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
