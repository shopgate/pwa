import { i18n } from '@shopgate/engage/core';

/**
 * Formats a float number to a string with limited decimals
 * and no grouping.
 * @param {number} value Value
 * @param {number} decimals Decimals
 * @param {string} locale Locale
 * @returns {string}
 */
const formatFloatLocale = (value, decimals, locale = navigator.language) => {
  try {
    return value.toLocaleString(locale, {
      style: 'decimal',
      useGrouping: false,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).toString();
  } catch (err) {
    return i18n.number(value, decimals);
  }
};

/**
 * Parses a float string to a float.
 * TODO: Needs to handle localized inputs like: 1,000,000.32 or 1.000.000,32
 * @param {string} value The string value.
 * @param {number} decimals The amount of decimals.
 * @returns {number}
 */
export const parseFloatString = (value, decimals) => +parseFloat(value.replace(',', '.')).toFixed(decimals);

/**
 * Formats a float to a string.
 * @param {float} value The float value.
 * @param {number} decimals The amount of decimals.
 * @returns {string}
 */
export const formatFloat = (value, decimals) => formatFloatLocale(value, decimals);
