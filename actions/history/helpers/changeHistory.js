/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import curry from 'lodash/curry';
import { logger } from '@shopgate/pwa-core/helpers';
import { history, parseObjectToQueryString } from '../../../helpers/router';
import { isFunction, isObject } from '../../../helpers/validation';

/**
 * A higher order thunk that is used to make changes to the router history.
 * @param {string} method The method to be called on the router history.
 * @param {string|Object} location A location string or object.
 * @see https://www.npmjs.com/package/history#navigation
 * @returns {Function} A redux thunk.
 */
const changeHistory = (method, location) => () => {
  if (!isFunction(history[method])) {
    logger.error(`Unable to call method '${method}' on router history.`);
  }

  let processedLocation = location;

  if (method === 'replace') {
    // Merge new location with previous location for convenience.
    processedLocation = {
      ...history.location,
      ...processedLocation,
    };
  }

  if (isObject(location) && isObject(location.params)) {
    // Parse location.params to a search query string for convenience.
    processedLocation = {
      ...processedLocation,
      search: parseObjectToQueryString(location.params),
    };
  }

  history[method](processedLocation);
};

const makeHistoryChange = curry(changeHistory);

export default makeHistoryChange;
