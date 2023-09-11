import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'vitest';
import IPtoCountry from '../components/IPtoCountry';
import nodeFetch from 'node-fetch';

global.fetch = nodeFetch;
global.Request = nodeFetch.Request;

const resWithSupportedCountry = {
  country_code: 'US',
  country_name: 'United States',
  IPv4: '135.250.43.126'
};

const resWithNonSupportedCountry = {
  country_code: 'KR',
  country_name: 'South Korea',
  IPv4: '125.250.43.126'
};

const notFoundIP = '225.250.43.126';

const resWithNotFound = {
  country_code: 'Not found',
  country_name: 'Not found',
  IPv4: 'Not found'
};

const resWithNull = {
  country_code: null,
  country_name: null,
  IPv4: '245.250.43.126'
};

const errorPath = 'errorPath';

const badIPFormatPath = '6.6';

const server = setupServer(
  ...[
    rest.get(`/geo/${resWithSupportedCountry.IPv4}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.json(resWithSupportedCountry));
    }),
    rest.get(`/geo/${resWithNonSupportedCountry.IPv4}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.json(resWithNonSupportedCountry));
    }),
    rest.get(`/geo/${notFoundIP}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.json(resWithNotFound));
    }),
    rest.get(`/geo/${resWithNull.IPv4}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.json(resWithNull));
    }),
    rest.get(`/geo/${badIPFormatPath}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.json(resWithSupportedCountry));
    }),
    rest.get(`/geo/${errorPath}`, (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(500));
    })
  ]
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('General form tests and basic functionality', () => {
  it('Renders label, textbox, and submit button', () => {
    render(<IPtoCountry />);

    const button = screen.getByRole('button', { name: 'Check IP' });

    expect(
      screen.getByLabelText('IP to Country', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('Updates the input textbox after typing', async () => {
    const user = userEvent.setup();
    render(<IPtoCountry />);

    const textbox = screen.getByRole('textbox');

    await user.type(textbox, '83.92.02.12');

    expect(textbox).toHaveValue('83.92.02.12');
  });

  it('Shows "Checking..." when loading after a request is submitted', async () => {
    const user = userEvent.setup();
    render(<IPtoCountry />);

    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithSupportedCountry.IPv4);
    await user.click(button);

    expect(screen.getByText('checking', { exact: false })).toBeInTheDocument();
  });
});

describe('Handling of different API responses', () => {
  it('Shows location message after submitting ip from from an identifiable country', async () => {
    const resultString = `IP address ${resWithSupportedCountry.IPv4} seems to be from ${resWithSupportedCountry.country_name}`;
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithSupportedCountry.IPv4);
    await user.click(button);
    await screen.findByText(resultString, { exact: false });

    expect(
      screen.getByText(resultString, { exact: false })
    ).toBeInTheDocument();
  });

  it('Shows appropriate message after submitting ip from an unidentifiable country', async () => {
    const resultString = `IP address ${notFoundIP} is not recognized as belonging to any country`;
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, notFoundIP);
    await user.click(button);
    await screen.findByText(resultString);

    expect(screen.getByText(resultString)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(notFoundIP);
  });

  it('Treats null values the same as unidentifiable country', async () => {
    const resultString = `IP address ${resWithNull.IPv4} is not recognized as belonging to any country`;
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithNull.IPv4);
    await user.click(button);
    await screen.findByText(resultString);

    expect(screen.getByText(resultString)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(resWithNull.IPv4);
  });

  it("Gives the option to update country if it's supported", async () => {
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithSupportedCountry.IPv4);
    await user.click(button);

    await screen.findByRole('button', {
      name: `Update country to ${resWithSupportedCountry.country_name}`
    });
  });

  it('Calls the handleCountryChange prop function if update button is clicked', async () => {
    const mockHandle = vi.fn();
    const user = userEvent.setup();
    render(<IPtoCountry handleCountryChange={mockHandle} />);
    const textbox = screen.getByRole('textbox');
    const checkIpButton = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithSupportedCountry.IPv4);
    await user.click(checkIpButton);

    const updateButton = await screen.findByRole('button', {
      name: `Update country to ${resWithSupportedCountry.country_name}`
    });

    await user.click(updateButton);

    expect(mockHandle).toHaveBeenCalledOnce();
    expect(mockHandle).toHaveBeenCalledWith(
      resWithSupportedCountry.country_code
    );
  });

  it('Shows a message that the service is not available if the country is not supported', async () => {
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, resWithNonSupportedCountry.IPv4);
    await user.click(button);

    const notAvailableMsg = await screen.findByText(
      'not available in English',
      {
        exact: false
      }
    );
    expect(notAvailableMsg).toBeInTheDocument();
  });

  it('Shows an error message if an error is thrown', async () => {
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, errorPath);
    await user.click(button);

    const errorMsg = await screen.findByText(
      'Error encountered - disabling your adblocker might help'
    );

    expect(errorMsg).toBeInTheDocument();
  });
});

describe('Advanced form and input field features', () => {
  it("Updates input value to match IP in received data (in case of bad format response is user's IP)", async () => {
    const resultString = `IP address ${resWithSupportedCountry.IPv4} seems to be from ${resWithSupportedCountry.country_name}`;
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, badIPFormatPath);
    await user.click(button);
    await screen.findByText(resultString, { exact: false });

    expect(textbox).toHaveValue(resWithSupportedCountry.IPv4);
  });

  it('Removes form response if response was received and a change was made to the input field', async () => {
    const resultString = `IP address ${resWithSupportedCountry.IPv4} seems to be from ${resWithSupportedCountry.country_name}`;
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, badIPFormatPath);
    await user.click(button);
    await screen.findByText(resultString, { exact: false });

    await user.type(textbox, '4');

    expect(
      screen.queryByText(resultString, { exact: false })
    ).not.toBeInTheDocument();
  });

  it("Calls the fetch inside the hook even if input value hasn't changed", async () => {
    const spyFetch = vi.spyOn(global, 'fetch');
    const user = userEvent.setup();
    render(<IPtoCountry />);
    const textbox = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Check IP' });

    await user.type(textbox, badIPFormatPath);
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(spyFetch).toHaveBeenCalledTimes(3);
  });
});
