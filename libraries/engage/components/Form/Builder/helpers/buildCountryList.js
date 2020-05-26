import { logger } from '@shopgate/pwa-core/helpers';
import iso3166 from './iso-3166-2';
import { getCountryNames } from '../../../../i18n/countries.helpers';

/**
 * Get country list for
 * @param {Object} countryElement Configuration of which form fields to render
 * @param {?Object} optional object to prepend optional choice
 * @return {Object}
 */
export default (countryElement, optional = null) => {
  // Check validity of the country element options list "countries"
  if (countryElement.countries !== null
    && countryElement.countries !== undefined
    && !Array.isArray(countryElement.countries)) {
    logger.error("Error: Invalid property type 'countries' in element " +
      `'${countryElement.id}'. Must be 'array', 'null' or 'undefined'`);
    return {};
  }
  // Build country display list for the country element (whitelist)
  // For 'null', 'undefined' and '[]' it shows all countries
  let countryKeys;
  if (countryElement.countries && countryElement.countries.length > 0) {
    countryKeys = countryElement.countries;
  } else {
    countryKeys = Object.keys(iso3166);
  }

  const countryList = getCountryNames(countryKeys);
  // Add a "no selection" element
  if (countryElement.required) {
    return countryList;
  }
  return {
    ...optional,
    ...countryList,
  };
};
