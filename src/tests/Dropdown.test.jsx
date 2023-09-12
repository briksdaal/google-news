import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import countries from '../assets/countries';
import { vi } from 'vitest';
import Dropdown from '../components/Dropdown';

const handleChange = vi.fn();

const dropdownData = countries;

it('Renders label', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  expect(
    screen.getByLabelText(dropdownData.label, { exact: false })
  ).toBeInTheDocument();
});

it('Renders the first option as disabled "Select a country"', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  const dropdown = screen.getByRole('combobox');
  const options = within(dropdown).getAllByRole('option');
  const firstOption = options[0];

  expect(firstOption).toHaveTextContent('Select a country');
  expect(firstOption).toHaveValue('');
  expect(firstOption).toHaveAttribute('disabled');
});

it('Renders selectable options with correct content and value', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  const dropdown = screen.getByRole('combobox');
  const options = within(dropdown).getAllByRole('option');

  options.shift();
  expect(options).toHaveLength(dropdownData.list.length);

  options.forEach((op, i) => {
    expect(op).toHaveTextContent(dropdownData.list[i].name);
    expect(op).toHaveValue(dropdownData.list[i].value);
    expect(op).not.toHaveAttribute('disabled');
  });
});

it('Shows disabled "Select a country" option if "selected" prop is not a supported country code', () => {
  render(<Dropdown dropdownData={dropdownData} />);

  expect(screen.getByRole('combobox')).toHaveValue('');
  expect(
    screen.getByRole('option', { name: 'Select a country' }).selected
  ).toBe(true);
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
