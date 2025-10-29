import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getCountryNames } from './countries.helpers';

/**
 * Custom hook to get country names as key-value pairs.
 * @param {string[]} [countryCodes=[]] An array of country codes.
 * @param {Object} [defaultLocales={}] Default locales from third-party sources.
 * @returns {Object|null} An object containing country names as key-value pairs.
 */
export function useCountriesNames(countryCodes = [], defaultLocales = {}) {
  return useMemo(() => getCountryNames(countryCodes, defaultLocales),
    [countryCodes, defaultLocales]);
}

useCountriesNames.propTypes = {
  countryCodes: PropTypes.arrayOf(PropTypes.string),
  defaultLocales: PropTypes.objectOf(PropTypes.string),
};

useCountriesNames.defaultProps = {
  countryCodes: [],
  defaultLocales: {},
};
