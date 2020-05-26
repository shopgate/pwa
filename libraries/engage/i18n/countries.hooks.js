// @flow
import { useMemo } from 'react';
import { getCountryNames } from './countries.helpers';

/**
 * Returns the countries names as key value pairs.
 * @param {string[]} [countryCodes=[]] .
 * @param {Object} [defaultLocales={}] Default locales from third party.
 * @returns {Object|null}
 */
export function useCountriesNames(
  countryCodes: string[] = [],
  defaultLocales: { [key: string]: any } = {}
): { [string]: string } {
  return useMemo(() => getCountryNames(countryCodes, defaultLocales),
    [countryCodes, defaultLocales]);
}
