import { logger } from '@shopgate/pwa-core';

const STORAGE_KEY = 'sgReduxLogger';
const MUTED = 'color: gray; font-weight: lighter;';

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
 * Formats the time of a date, e.g. 14:03:07.042.
 * @param {Date} date The date.
 * @return {string}
 */
const formatTime = date => [date.getHours(), date.getMinutes(), date.getSeconds()]
  .map(value => String(value).padStart(2, '0'))
  .join(':')
  .concat(`.${String(date.getMilliseconds()).padStart(3, '0')}`);

/**
 * Prints an action as a collapsed console group.
 * @param {Object} entry The logged action with the states before and after it.
 */
const printEntry = ({
  action, prevState, nextState, error, startedAt, took,
}) => {
  logger.groupCollapsed(
    `%c action %c${String(action.type)} %c@ ${formatTime(startedAt)} %c(in ${took.toFixed(2)} ms)`,
    MUTED,
    'color: inherit;',
    MUTED,
    MUTED
  );
  logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
  logger.log('%c action    ', 'color: #03A9F4; font-weight: bold', action);
  if (error) {
    logger.log('%c error     ', 'color: #F20404; font-weight: bold;', error);
  }
  logger.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
  logger.groupEnd();
};

/**
 * Logs every action with the state before and after it to the console, unless the logger was
 * switched off with sgReduxLogger.off() in the console.
 * @param {Object} store The redux store.
 * @return {Function}
 */
const loggerMiddleware = ({ getState }) => next => (action) => {
  if (!enabled) {
    return next(action);
  }

  const startedAt = new Date();
  const started = performance.now();
  const prevState = getState();
  let result;
  let error;

  try {
    result = next(action);
  } catch (e) {
    error = e;
  }

  printEntry({
    action,
    prevState,
    nextState: getState(),
    error,
    startedAt,
    took: performance.now() - started,
  });

  if (error) {
    throw error;
  }

  return result;
};

export default loggerMiddleware;
