export default function Dropdown({ selected = '', handleChange, object }) {
  return (
    <>
      <label>
        {object.label}
        {': '}
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}>
          {object.list.map((t) => (
            <option
              key={t.name}
              value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
