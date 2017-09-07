/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import debounce from 'lodash/debounce';

/**
 * The key name for the state in the localStorage.
 * @type {string}
 */
const LOCALSTORAGE_KEY = 'shopgateState';

/**
 * The debounce timing for the localStorage write.
 * @type {number}
 */
const DEBOUNCE_TIMING = 300;

/**
 * Registry
 * @type {Object}
 */
const registeredVersions = {};

/**
 * Registers a reducer by name and version.
 * @param {string} reducerName The name of the reducer.
 * @param {string} version The version.
 */
const registerVersion = (reducerName, version) => {
  registeredVersions[reducerName] = version;
};

/**
 * Gets the persistent state from the localStorage.
 * @returns {Object}
 */
const getPersistentState = () => {
  // Read from localStorage.
  const jsonSavedState = localStorage.getItem(LOCALSTORAGE_KEY);
  if (jsonSavedState === null) {
    return {};
  }

  const savedState = JSON.parse(jsonSavedState);
  const savedStateValidated = {};

  // Validate all entries.
  Object.keys(savedState).forEach((reducerName) => {
    if (savedState[reducerName].version === registeredVersions[reducerName]) {
      savedStateValidated[reducerName] = { ...savedState[reducerName].state };
    }
  });

  return savedStateValidated;
};

/**
 * Latest and saved state.
 * @type {Object}
 */
let latestState = {};

/**
 * Initializes the persistent storage and returns the saved state.
 * @returns {Object}
 */
export const initPersistentStorage = () => {
  const state = getPersistentState();
  latestState = { ...state };
  return state;
};

/**
 * Saves the state to the localStorage. (Debounced!)
 */
const saveState = debounce(() => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(latestState));
}, DEBOUNCE_TIMING);

/**
 * Wraps the original reducer and saves all related changes to the localStorage.
 * @param {string} reducerName The name of the reducer.
 * @param {Object} reducer The reducer.
 * @param {string} version The current version.
 * @returns {Object}
 */
export const persist = (reducerName, reducer, version) => {
  registerVersion(reducerName, version);

  return (state, action) => {
    const updatedState = reducer(state, action);

    latestState = {
      ...latestState,
      [reducerName]: {
        version,
        state: updatedState,
      },
    };
    saveState();

    return updatedState;
  };
};
