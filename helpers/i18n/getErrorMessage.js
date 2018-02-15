/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const versionSuffix = /_v\d+$/;

/**
 * Checks if there's any specific message for given pipeline and error.
 * If yes, returns a translation string. If not, falls back to `error.message`.
 * @param {string} name Pipeline name.
 * @param {Object} error Error object.
 * @param {Object} errorCodeMappings Mapping between pipeline name/error code and translation key.
 * @return {string} Mapped translation key or error.message
 */
const getErrorMessage = (name, error, errorCodeMappings) => {
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

export default getErrorMessage;
