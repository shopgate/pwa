/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

  messageCache[hash] = new IntlMessageFormat(
    getPath(locales, key, key),
    langCode
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
