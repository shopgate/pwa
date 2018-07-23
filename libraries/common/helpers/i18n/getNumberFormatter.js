import IntlMessageFormat from 'intl-messageformat';
import curry from 'lodash/curry';
import messageCache from './messageCache';

/**
 * Returns an instance of IntlMessageFormat from cache based on a hash.
 * The hash is generated from given language code and translation key.
 * If no instance exists yet, a new instance will be created and returned.
 * @param {string} langCode A language code.
 * @param {boolean} fractions With or without fraction digits.
 * @returns {IntlMessageFormat}
 */
const getFormattedNumberFromCache = (langCode, fractions) => {
  const hash = `${langCode}_number_fr_${fractions}`;

  // Check if a cached instance already exists.
  if (messageCache[hash]) {
    return messageCache[hash];
  }

  messageCache[hash] = new IntlMessageFormat(
    '{value, number, decimal}',
    langCode,
    {
      number: {
        decimal: {
          style: 'decimal',
          minimumFractionDigits: fractions,
          maximumFractionDigits: fractions,
        },
      },
    }
  );

  return messageCache[hash];
};

/**
 * Get a formatted price by currency and language code.
 * @param {string} langCode A language code.
 * @param {number} value The number to format.
 * @param {boolean} fractions Nnumber of digits after dot.
 * @returns {string}
 */
const formatNumber = (langCode, value, fractions) => (
  getFormattedNumberFromCache(langCode, fractions).format({ value })
);

const getNumberFormatter = curry(formatNumber);

export default getNumberFormatter;
