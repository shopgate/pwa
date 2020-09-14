import IntlMessageFormat from 'intl-messageformat';
import curry from 'lodash/curry';
// eslint-disable-next-line import/no-named-default
import { default as getPath } from 'lodash/get';
import moment from 'moment';
import messageCache from './messageCache';

/**
 * Pure function to return original key whet Intl message not found
 * @param {*} key origin intl key to return
 * @returns {*}
 */
const pureReturn = key => ({
  format: () => key,
});

/**
 * Returns an instance of IntlMessageFormat from cache based on a hash.
 * The hash is generated from given language code and translation key.
 * If no instance exists yet, a new instance will be created and returned.
 * @param {Object} locales A locales object.
 * @param {string} langCode A language code.
 * @param {string} key A translation key.
 * @returns {IntlMessageFormat}
 */
const getMessageFromCache = (locales, langCode, key) => {
  const hash = `${langCode}_${key}`;

  // Check if a cached instance already exists.
  if (messageCache[hash]) {
    return messageCache[hash];
  }

  const message = getPath(locales, key);
  if (typeof message !== 'string' || message.length === 0) {
    return pureReturn(key);
  }

  // Prevent the app from crashing when strings (like product names) don't comply with the format
  try {
    messageCache[hash] = new IntlMessageFormat(
      message,
      langCode,
      getPath(locales, 'formats')
    );
  } catch (e) {
    messageCache[hash] = pureReturn(key);
  }

  return messageCache[hash];
};

/**
 * Get a translation for a given key.
 * @param {Object} locales A locales object.
 * @param {string} langCode A language code.
 * @param {string} key A translation key.
 * @param {Object} [args] Arguments for the translation.
 * @returns {string}
 */
const translate = (locales, langCode, key, args = {}) => {
  /**
   * @returns {Object}
   */
  const sanitizeArgs = () => {
    if (typeof args !== 'object' || args === null) {
      return args;
    }

    return Object.keys(args).reduce((acc, arg) => {
      const date = moment(args[arg], moment.ISO_8601, true);

      if (date.isValid() && date.toISOString() === args[arg]) {
        acc[arg] = new Date(args[arg]).getTime();
      } else {
        acc[arg] = args[arg];
      }

      return acc;
    }, {});
  };

  return getMessageFromCache(locales, langCode, key).format(sanitizeArgs());
};

export default curry(translate);
