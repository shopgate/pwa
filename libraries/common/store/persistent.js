import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import localforage from './localforage';

const { appId = '' } = process.env.APP_CONFIG || {};
const theme = process.env.THEME || 'theme';

/**
 * The key name for the state in the localStorage.
 * @type {string}
 */
export const STORAGE_KEY = `sgCloud-${appId.replace('_', '')}-${theme}`;

localforage.config({
  name: 'shopgate-connect',
  driver: localforage.INDEXEDDB,
});

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
 * Normalizes the restored state to be predictable and non-breaking.
 * @param {Object} state The state.
 * @return {Object} The normalized state that is safe to persist.
 */
export const normalizeState = (state) => {
  if (!state || typeof state !== 'object') {
    // If state is not an object or array return it directly.
    return state;
  }

  if (Array.isArray(state)) {
    // Iterate over arrays.
    return state.map(item => normalizeState(item));
  }

  /**
   * Traverse the passed state and set any isFetching property to false. This avoids any false
   * positives when determining if requests are ongoing.
   */
  return Object.keys(state).reduce((newState, key) => {
    if (key === 'isFetching' && typeof state[key] === 'boolean') {
      // Never persist the isFetching state of a cache item.
      return {
        ...newState,
        isFetching: false,
      };
    }

    // Recurse and continue iteration.
    return {
      ...newState,
      [key]: normalizeState(state[key]),
    };
  }, {});
};

/**
 * Gets the persistent state from the localStorage.
 * @returns {Object}
 */
const getPersistentState = async () => {
  // Read from localStorage.
  const jsonSavedState = await localforage.getItem(STORAGE_KEY);
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

  // Take care that the cached state is normalized before it's restored.
  return normalizeState(savedStateValidated);
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
 * Saves the state to the localStorage.
 */
const saveState = debounce(async () => {
  await localforage.setItem(STORAGE_KEY, JSON.stringify(latestState));
}, DEBOUNCE_TIMING);

/**
 * Wraps the original reducer and saves all related changes to the localStorage.
 * @param {string} reducerName The name of the reducer.
 * @param {Function} reducer The reducer.
 * @param {string} version The current version.
 * @param {Array} blacklist Entries in the state to ignore and not cache.
 * @returns {Object}
 */
export const persist = (reducerName, reducer, version, blacklist = []) => {
  registerVersion(reducerName, version);

  return (state, action) => {
    const updatedState = reducer(state, action);

    latestState = {
      ...latestState,
      [reducerName]: {
        version,
        state: omit(updatedState, blacklist),
      },
    };
    saveState();

    return updatedState;
  };
};
