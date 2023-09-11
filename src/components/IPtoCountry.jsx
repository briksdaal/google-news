import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useGetCountryFromIp from '../hooks/useGetCountryFromIp';
import { codeToCountry } from '../assets/countries';

function FormResponse({
  data,
  loading,
  error,
  handleCountryChange,
  newTyping
}) {
  function onSubmit(e) {
    e.preventDefault();
    handleCountryChange(data.country_code);
  }

  if (loading) return <h2>Checking...</h2>;

  if (error)
    return <h2>Error encountered - disabling your adblocker might help</h2>;

  if (data && !newTyping) {
    if (data.country_code) {
      return (
        <>
          <p>
            IP Address {data.IPv4} seems to be from {data.country_name}
          </p>
          {data.country_code in codeToCountry ? (
            <form onSubmit={onSubmit}>
              <button>Update country to {data.country_name}</button>
            </form>
          ) : (
            <p>
              Google News in {data.country_name} is not available in English
            </p>
          )}
        </>
      );
    } else {
      return (
        <p>
          IP address {data.IPv4} is not recognized as belonging to any country
        </p>
      );
    }
  }
}

FormResponse.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
  newTyping: PropTypes.bool,
  handleCountryChange: PropTypes.func
};

function IPtoCountry({ handleCountryChange }) {
  const [inputValue, setInputValue] = useState('');
  const [newTyping, setNewTyping] = useState(false);
  const [ip, setIp] = useState({ ip: '' });
  const [data, loading, error] = useGetCountryFromIp(ip);

  useEffect(() => {
    setNewTyping(false);

    if (!data) return;

    setInputValue(data.IPv4);
  }, [data]);

  function onInputChange(e) {
    setInputValue(e.target.value);
    setNewTyping(true);
  }

  function handleIPLookup(e) {
    e.preventDefault();
    setIp({ ip: inputValue });
  }

  return (
    <>
      <form onSubmit={handleIPLookup}>
        <label>
          IP to Country:
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
          />
        </label>
        <button type="submit">Check IP</button>
      </form>
      <FormResponse
        data={data}
        loading={loading}
        error={error}
        newTyping={newTyping}
        handleCountryChange={handleCountryChange}
      />
    </>
  );
}

IPtoCountry.propTypes = {
  handleCountryChange: PropTypes.func
};

export default IPtoCountry;
