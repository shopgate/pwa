/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isPlainObject from 'lodash/isPlainObject';
import defaultsDeep from 'lodash/defaultsDeep';

/**
 * Merges two translation objects together.
 * @param {Object} destination The destination object.
 * @param {Object} source The default translations object.
 * @return {Object}
 */
const mergeTranslations = (destination, source) => {
  let extension = {};

  if (isPlainObject(destination)) {
    Object.keys(destination).forEach((key) => {
      if (key.includes(process.env.LANG)) {
        extension = destination[key];
      }
    });
  }

  return defaultsDeep(extension, source);
};

export default mergeTranslations;
