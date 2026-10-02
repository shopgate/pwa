import { createLogger } from 'redux-logger';
import { logger } from '@shopgate/pwa-core';

const STORAGE_KEY = 'sgReduxLogger';

const reduxLogger = createLogger({
  logger,
  collapsed: true,
  duration: true,
});

/**
 * Reads whether the logger was switched off with sgReduxLogger.off().
 * @return {boolean}
 */
const isSwitchedOff = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'off';
  } catch (e) {
    return false;
  }
};

let enabled = !isSwitchedOff();

/**
 * Remembers the switch for the next app start.
 * @param {boolean} value Whether actions are logged.
 * @return {boolean} Whether the switch could be saved.
 */
const saveSwitch = (value) => {
  try {
    if (value) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, 'off');
    }
  } catch (e) {
    return false;
  }

  return true;
};

/**
 * Switches the logger on or off.
 * @param {boolean} value Whether actions are logged.
 */
const setEnabled = (value) => {
  enabled = value;
  const saved = saveSwitch(value);
  logger.info(`Redux logger switched ${value ? 'on' : 'off'}${saved ? '' : ' until the next reload'}`);
};

window.sgReduxLogger = {
  on: () => setEnabled(true),
  off: () => setEnabled(false),
};

/**
 * Logs every action with the state before and after it to the console, unless the logger was
 * switched off with sgReduxLogger.off() in the console.
 * @param {Object} store The redux store.
 * @return {Function}
 */
const loggerMiddleware = store => (next) => {
  const logAndNext = reduxLogger(store)(next);
  return action => (enabled ? logAndNext(action) : next(action));
};

export default loggerMiddleware;
