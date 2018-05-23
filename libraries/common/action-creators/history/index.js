import {
  HISTORY_DID_RESET,
  HISTORY_WILL_RESET,
  OPEN_LINK,
  UPDATE_HISTORY,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched HISTORY_DID_RESET action object.
 * @return {Object} The dispatched action object.
 */
export const historyDidReset = () => ({
  type: HISTORY_DID_RESET,
});

/**
 * Creates the dispatched HISTORY_WILL_RESET action object.
 * @return {Object} The dispatched action object.
 */
export const historyWillReset = () => ({
  type: HISTORY_WILL_RESET,
});

/**
 * Creates the dispatched OPEN_LINK action object.
 * @param {string} name The link action name.
 * @param {Object|string} options The link action options or an url.
 * @return {Object} The dispatched action object.
 */
export const openLink = (name, options) => ({
  type: OPEN_LINK,
  name,
  options,
});

/**
 * Creates the dispatched UPDATE_HISTORY action object.
 * @param {Object} historyProps The updated history props.
 * @return {Object} The dispatched action object.
 */
export const updateHistory = historyProps => ({
  type: UPDATE_HISTORY,
  historyProps,
});
