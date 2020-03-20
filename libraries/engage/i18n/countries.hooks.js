import { useMemo } from 'react';
import { i18n } from '../core';

/**
 * Returns the countries names as key value pairs.
 * @param {string[]} [countryCodes=[]] .
 * @returns {Object|null}
 */
export function useCountriesNames(countryCodes = []) {
  return useMemo(() => {
    const localeCountries = i18n.getPath('countries') || {};
    if (!countryCodes.length) {
      return localeCountries;
    }
    return countryCodes.reduce((acc, code) => ({
      ...acc,
      [code]: localeCountries[code] || code,
    }), {});
  }, [countryCodes]);
}
