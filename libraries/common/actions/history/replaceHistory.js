import changeHistory from './helpers/changeHistory';

/**
 * Replaces the current location in the history.
 * @param {Object|string} location The location to set.
 * @returns {Function} A redux thunk.
 */
export default changeHistory('replace');
