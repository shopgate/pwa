import changeHistory from './helpers/changeHistory';

/**
 * Pushes a new location on top of the history.
 * @param {Object|string} location The location to push to the history.
 * @returns {Function} A redux thunk.
 */
export default changeHistory('push');
