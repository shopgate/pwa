import IntlMessageFormat from 'intl-messageformat';
import curry from 'lodash/curry';
// eslint-disable-next-line import/no-named-default
import { default as getPath } from 'lodash/get';
import messageCache from './messageCache';

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

  let message = getPath(locales, key, key);

  if (typeof message !== 'string') {
    message = key;
  }

  messageCache[hash] = new IntlMessageFormat(
    message,
    langCode,
    getPath(locales, 'formats')
  );

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
const translate = (locales, langCode, key, args = {}) => (
  getMessageFromCache(locales, langCode, key).format(args)
);

export default curry(translate);
