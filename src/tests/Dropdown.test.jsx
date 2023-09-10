import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Dropdown from '../components/Dropdown';

const handleChange = vi.fn();

const dropdownData = {
  label: 'Title',
  list: [
    {
      name: 'itemnumber1',
      value: '111'
    },
    {
      name: 'itemnumber2',
      value: '222'
    },
    {
      name: 'itemnumber3',
      value: '333'
    },
    {
      name: 'itemnumber4',
      value: '444'
    },
    {
      name: 'itemnumber5',
      value: '555'
    }
  ]
};

it('Renders label', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  expect(
    screen.getByLabelText(dropdownData.label, { exact: false })
  ).toBeInTheDocument();
});

it('Renders options with correct content and value', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  const dropdown = screen.getByRole('combobox');
  const options = within(dropdown).getAllByRole('option');

  expect(options).toHaveLength(dropdownData.list.length);

  options.forEach((op, i) => {
    expect(op).toHaveTextContent(dropdownData.list[i].name);
    expect(op).toHaveValue(dropdownData.list[i].value);
  });
});

it('Shows selected option according to selected prop', () => {
  const selected = dropdownData.list[3];
  render(
    <Dropdown
      selected={selected.value}
      dropdownData={dropdownData}
    />
  );

  expect(screen.getByRole('combobox')).toHaveValue(selected.value);
  expect(screen.getByRole('option', { name: selected.name }).selected).toBe(
    true
  );
});

it('Calls handle function with new value after option change', async () => {
  const user = userEvent.setup();
  const selectedBefore = dropdownData.list[3];
  const selectedAfter = dropdownData.list[1];
  render(
    <Dropdown
      selected={selectedBefore.value}
      handleChange={handleChange}
      dropdownData={dropdownData}
    />
  );

  const dropdown = screen.getByRole('combobox');

  await user.selectOptions(dropdown, selectedAfter.name);

  expect(handleChange).toHaveBeenCalledWith(selectedAfter.value);
  expect(handleChange).toHaveBeenCalledTimes(1);
});
