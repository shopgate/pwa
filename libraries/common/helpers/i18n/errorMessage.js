/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import merge from 'lodash/merge';

const versionSuffix = /_v\d+$/;

/**
 * Variable where every added mapping is stored
 * @type {Object}
 */
const errorCodeMappings = {};

/**
 * Adds the provided mapping to the mapping store.
 * @param {Object} mappings Mapping between pipeline name/error code and translation key.
 * @return {Object}
 */
export const addErrorMessageMapping = mappings => merge(errorCodeMappings, mappings);

/**
 * Checks if there's any specific message for given pipeline and error.
 * If yes, returns a translation string. If not, falls back to `error.message`.
 * @param {string} name Pipeline name.
 * @param {Object} error Error object.
 * @return {string} Mapped translation key or error.message
 */
export const getErrorMessage = (name, error) => {
  // Remove the version suffix from the pipeline name
  const unversionedName = name.replace(versionSuffix, '');

  const mappingForName = errorCodeMappings[unversionedName];

  // Check if we have a mapping for the pipeline name
  if (mappingForName) {
    if (typeof mappingForName === 'string') {
      return mappingForName;
    }

    const mappingForCode = mappingForName[error.code];
    // Check if we have a mapping for the error code
    if (typeof mappingForCode === 'string') {
      return mappingForCode;
    }
  }

  return error.message;
};
