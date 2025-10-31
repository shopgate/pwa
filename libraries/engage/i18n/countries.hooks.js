import { useMemo } from 'react';
import { getCountryNames } from './countries.helpers';

/**
 * Custom hook to get country names as key-value pairs.
 * @param {string[]} [countryCodes=[]] An array of country codes.
 * @param {Object} [defaultLocales={}] Default locales from third-party sources.
 * @returns {Object|null} An object containing country names as key-value pairs.
 */
export const useCountriesNames = (
  countryCodes = [],
  defaultLocales = {}
) => useMemo(() => getCountryNames(countryCodes, defaultLocales),
  [countryCodes, defaultLocales]);
