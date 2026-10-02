/* eslint global-require: "off" */
const mockLog = jest.fn();

jest.mock('redux-logger', () => ({
  createLogger: () => () => next => (action) => {
    mockLog(action);
    return next(action);
  },
}));

jest.mock('@shopgate/pwa-core', () => ({
  logger: { info: jest.fn() },
}));

/**
 * Loads the middleware freshly, so it reads the local storage again.
 * @return {Function} The action handler of the middleware.
 */
const createHandler = () => {
  let loggerMiddleware;
  jest.isolateModules(() => {
    loggerMiddleware = require('./logger').default;
  });

  return loggerMiddleware({})(action => `next:${action.type}`);
};

describe('logger middleware', () => {
  const action = { type: 'TEST' };

  beforeEach(() => {
    window.localStorage.clear();
    mockLog.mockClear();
  });

  it('logs actions by default', () => {
    const handle = createHandler();

    expect(handle(action)).toBe('next:TEST');
    expect(mockLog).toHaveBeenCalledWith(action);
  });

  it('stops logging after sgReduxLogger.off() and saves the switch', () => {
    const handle = createHandler();
    window.sgReduxLogger.off();

    expect(handle(action)).toBe('next:TEST');
    expect(mockLog).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('sgReduxLogger')).toBe('off');
  });

  it('logs again after sgReduxLogger.on() and removes the switch', () => {
    const handle = createHandler();
    window.sgReduxLogger.off();
    window.sgReduxLogger.on();

    handle(action);
    expect(mockLog).toHaveBeenCalledWith(action);
    expect(window.localStorage.getItem('sgReduxLogger')).toBeNull();
  });

  it('stays switched off after a reload', () => {
    window.localStorage.setItem('sgReduxLogger', 'off');
    const handle = createHandler();

    expect(handle(action)).toBe('next:TEST');
    expect(mockLog).not.toHaveBeenCalled();
  });
});
