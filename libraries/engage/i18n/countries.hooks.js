// @flow
import { useMemo } from 'react';
import { i18n } from '../core';

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
  return useMemo(() => {
    const lang = i18n.getLang().split('-')[0];
    const defaultLocale = defaultLocales[lang] || defaultLocales.en || {};
    const localeCountries = i18n.getPath('countries') || {};

    if (!countryCodes.length) {
      return localeCountries;
    }

    const translated: { [string]: string } = countryCodes.reduce((acc, code) => ({
      ...acc,
      [code]: localeCountries[code] || defaultLocale[code] || code,
    }), {});

    if (Object.keys(defaultLocale).length !== 0) {
      return {
        ...defaultLocale,
        ...translated,
      };
    }

    return translated;
  }, [countryCodes, defaultLocales]);
}
