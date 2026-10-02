/* eslint global-require: "off" */
import { logger } from '@shopgate/pwa-core';

jest.mock('@shopgate/pwa-core', () => ({
  logger: {
    groupCollapsed: jest.fn(),
    groupEnd: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
  },
}));

const prevState = { cart: { count: 0 } };
const nextState = { cart: { count: 1 } };

/**
 * Loads the middleware freshly, so it reads the local storage again, and connects it to a store
 * whose state changes with the first action.
 * @param {Function} [reducer] Called instead of the reducer to simulate errors.
 * @return {Function} The action handler of the middleware.
 */
const createHandler = (reducer = () => 'result') => {
  let loggerMiddleware;
  jest.isolateModules(() => {
    loggerMiddleware = require('./logger').default;
  });

  let state = prevState;
  const store = { getState: () => state };

  return loggerMiddleware(store)((action) => {
    const result = reducer(action);
    state = nextState;
    return result;
  });
};

describe('logger middleware', () => {
  const action = { type: 'ADD_TO_CART' };

  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('logs an action with the states before and after it', () => {
    const handle = createHandler();

    expect(handle(action)).toBe('result');
    expect(logger.groupCollapsed).toHaveBeenCalledWith(
      expect.stringMatching(/^%c action %cADD_TO_CART %c@ \d{2}:\d{2}:\d{2}\.\d{3} %c\(in \d+\.\d{2} ms\)$/),
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
      'color: gray; font-weight: lighter;'
    );
    expect(logger.log.mock.calls).toEqual([
      ['%c prev state', 'color: #9E9E9E; font-weight: bold', prevState],
      ['%c action    ', 'color: #03A9F4; font-weight: bold', action],
      ['%c next state', 'color: #4CAF50; font-weight: bold', nextState],
    ]);
    expect(logger.groupEnd).toHaveBeenCalledTimes(1);
  });

  it('logs and rethrows errors of the reducers', () => {
    const error = new Error('Reducer failed');
    const handle = createHandler(() => {
      throw error;
    });

    expect(() => handle(action)).toThrow(error);
    expect(logger.log).toHaveBeenCalledWith('%c error     ', 'color: #F20404; font-weight: bold;', error);
    expect(logger.groupEnd).toHaveBeenCalledTimes(1);
  });

  it('stops logging after sgReduxLogger.off() and saves the switch', () => {
    const handle = createHandler();
    window.sgReduxLogger.off();

    expect(handle(action)).toBe('result');
    expect(logger.groupCollapsed).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('sgReduxLogger')).toBe('off');
  });

  it('logs again after sgReduxLogger.on() and removes the switch', () => {
    const handle = createHandler();
    window.sgReduxLogger.off();
    window.sgReduxLogger.on();

    handle(action);
    expect(logger.groupCollapsed).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem('sgReduxLogger')).toBeNull();
  });

  it('stays switched off after a reload', () => {
    window.localStorage.setItem('sgReduxLogger', 'off');
    const handle = createHandler();

    expect(handle(action)).toBe('result');
    expect(logger.groupCollapsed).not.toHaveBeenCalled();
  });
});
