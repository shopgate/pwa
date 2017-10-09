/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import processHistoryUpdate from '../../actions/history/processHistoryUpdate';
import { DEFAULT_SORT } from '../../constants/DisplayOptions';
import { isObject } from '../validation';
import { sortObject } from '../data';

/**
 * Determines if an item has expired and therefore should fetch or re-fetch it's data.
 * @param {Object} item The item to determine if it has expired.
 * @return {boolean}
 */
export const hasExpired = (item) => {
  if (!item.isFetching) {
    // If the expiry date has expired or is set to 0 (initial value).
    if (item.expires === 0 || (item.expires && item.expires > 0 && item.expires < Date.now())) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if an item can be fetched or (only when the itemKey parameter is set) if there is a
 * certain key inside the item that is filled with data.
 * @param {Object} item The item to check.
 * @param {string} [itemKey=null] A key of a property to check additionally.
 * @param {string} [requiredCount=null] The number of required products that should be in the store.
 * @return {boolean} Whether it can be fetched.
 */
export const shouldFetchData = (item, itemKey = null, requiredCount = null) => {
  // Get data if we have none.
  if (!item) {
    return true;
  }

  // Fetch data if we have an empty object in the store.
  if (isObject(item) && Object.keys(item).length === 0) {
    return true;
  }

  // Check that the item is not fetching currently.
  if (!item.isFetching) {
    // Fetch data if the expiry date has expired or is set to 0 (initially set).
    if (item.expires === 0 || (item.expires && item.expires > 0 && item.expires < Date.now())) {
      return true;
    }

    // Check for parameters that enable sub item counting
    const checkSubItems = typeof item.totalResultCount !== 'undefined' || requiredCount !== null;

    // Check for a specific key inside items and fetch it if it's not found.
    if (checkSubItems && itemKey && Array.isArray(item[itemKey])) {
      let maxItems = requiredCount || item.totalResultCount;

      // Check if we are requesting more items that there is available.
      if (maxItems > item.totalResultCount) {
        maxItems = item.totalResultCount;
      }

      // Check if we have enough items in the store.
      if (item[itemKey].length !== maxItems) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Determine if there should be a request to fetch the filter data.
 * @param {Object} item The filter object.
 * @returns {boolean}
 */
export const shouldFetchFilters = (item) => {
  // Get data if we no item.
  if (!item) {
    return true;
  }

  // Fetch data if we have an empty object in the store.
  if (isObject(item) && Object.keys(item).length === 0) {
    return true;
  }

  if (hasExpired(item)) {
    return true;
  }

  return false;
};

/**
 * Generates a hash from an object with sorted values.
 * @param {Object} input The input object.
 * @return {string} The generated hash.
 */
export const generateSortedHash = input => JSON.stringify(sortObject(input));

/**
 * Deep compares two objects.
 * @param {Object} input1 The first object.
 * @param {Object} input2 The second object.
 * @return {boolean}
 */
export const compareObjects = (input1, input2) =>
  (generateSortedHash(input1) === generateSortedHash(input2))
;

/**
 * Generates a hash for product collection results.
 * @param {Object} params The request parameters.
 * @param {boolean} [includeSort=true] Whether to include the sorting in the hash.
 * @return {string} The generated hash.
 */
export const generateResultHash = (params, includeSort = true) => {
  const defaultParams = {
    pipeline: 'getProducts',
    ...includeSort && { sort: DEFAULT_SORT },
    filters: {},
  };

  let mergedParams = {
    ...defaultParams,
    ...params,
  };

  const { searchPhrase } = mergedParams;

  if (typeof searchPhrase !== 'undefined') {
    mergedParams = {
      ...mergedParams,
      searchPhrase: searchPhrase.trim(),
    };
  }

  return generateSortedHash(mergedParams);
};

/**
 * Syncs the history into the store.
 * @param {Object} location A reference to the browser history location.
 * @param {Object} action A reference to the browser history action.
 * @param {Object} historyStackRef A reference to the history stack.
 * @param {Object} storeRef A reference to the redux store.
 */
const syncHistory = (location, action, historyStackRef, storeRef) => {
  const historyProps = {
    ...location,
    action,
    length: historyStackRef.getLength(),
  };

  const state = storeRef.getState();

  /*
   * We need this check here to make redirects work correctly.
   * The problem is that this callback here is called in the opposite order (LIFO).
   * of how the history changes happened. If we dispatch:
   * 1. updateHistory checkout
   * 2. updateHistory login
   *
   * We receive here first the login change and then the checkout change.
   * This causes a wrong state in our redux history.
   * Because of this we need to ignore this change here
   */
  if (
    state.history.redirectLocation &&
    state.history.redirectLocation.pathname === location.pathname
  ) {
    return;
  }

  storeRef.dispatch(processHistoryUpdate(historyProps));
};

/**
 * Initially syncs the history with the store and then creates a listener for future changes.
 * @param {Object} history A reference to the browser history.
 * @param {Object} store A reference to the redux store.
 * @param {Object} historyStack A reference to the history stack.
 * @returns {Object} The passed history reference.
 */
export const syncHistoryWithStore = (history, store, historyStack) => {
  /**
   * Initially sync the history with the store.
   * We need to use setTimeout to push this call to the next tick.
   */
  syncHistory(history.location, history.action, historyStack, store);
  /**
   * Sync any further history changes with the store.
   */
  history.listen((location, action) => syncHistory(location, action, historyStack, store));

  return history;
};
