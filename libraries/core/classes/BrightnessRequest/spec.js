/* eslint-disable import/named */
import {
  mockedSetCommandName,
  mockedSetLibVersion,
  mockedDispatch,
  triggerDispatchError,
} from '../AppCommand';
/* eslint-enable import/named */

const mockedAddCallback = jest.fn();
jest.mock('../Event', () => ({
  addCallback: (...args) => {
    mockedAddCallback(...args);
  },
}));

jest.mock('../AppCommand');

const mockedLoggerError = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => {
      mockedLoggerError(...args);
    },
  },
}));

describe('BrightnessRequest', () => {
  /* eslint-disable global-require */
  const brightnessRequest = require('./index').default;
  const { BrightnessRequest } = require('./index');
  /* eslint-enable global-require */

  beforeEach(() => {
    mockedLoggerError.mockClear();
    mockedAddCallback.mockClear();
    mockedSetCommandName.mockClear();
    mockedSetLibVersion.mockClear();
    mockedDispatch.mockClear();

    // Reset the queue for each test
    brightnessRequest.responseQueue = [];
  });

  it('should export an already instantiated class', () => {
    expect(brightnessRequest).toBeInstanceOf(BrightnessRequest);
    expect(brightnessRequest.responseQueue).toEqual([]);
  });

  it('should dispatch a command and prepare a handler for response', async () => {
    brightnessRequest.dispatch()
      .then((result) => {
        expect(mockedSetCommandName).toHaveBeenCalled();
        expect(mockedSetCommandName).toHaveBeenLastCalledWith('getCurrentBrightness');
        expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
        expect(mockedSetLibVersion).toHaveBeenLastCalledWith('17.0');
        expect(mockedDispatch).toHaveBeenCalledTimes(1);
        expect(brightnessRequest.responseQueue).toHaveLength(0);
        expect(result).toBe(100);
      });

    await brightnessRequest.handleResponse({ brightness: 100 });
  });

  it('should handle two parallel requests as expected', async () => {
    // Prepare two requests
    const requestOne = brightnessRequest.dispatch();
    const requestTwo = brightnessRequest.dispatch();

    // Check if the queue looks like expected
    expect(brightnessRequest.responseQueue).toHaveLength(2);

    requestOne
      .then((result) => {
        expect(brightnessRequest.responseQueue).toHaveLength(1);
        expect(result).toBe(100);
      });

    requestTwo
      .then((result) => {
        expect(brightnessRequest.responseQueue).toHaveLength(0);
        expect(result).toBe(80);
      });

    // Simulate incoming of the first event
    await brightnessRequest.handleResponse({ brightness: 100 });
    await brightnessRequest.handleResponse({ brightness: 80 });
  });

  it('should reject a promise when response is not valid', (done) => {
    const assertError = new Error('Did not reject');
    brightnessRequest.dispatch()
      .then(() => {
        throw assertError;
      })
      .catch((e) => {
        expect(e).not.toBe(assertError);
        done();
      });

    brightnessRequest.handleResponse({ brightnessFFOFOF: 100 });
  });

  it('should reject a promise when the command dispatch failed', async () => {
    // Configure the AppCommand mock to respolve with an error.
    triggerDispatchError();

    try {
      await brightnessRequest.dispatch();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain('getCurrentBrightness');
      expect(brightnessRequest.responseQueue).toHaveLength(0);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    }
  });

  it('should handle incoming events which did not have a dispatch', () => {
    const result = brightnessRequest.handleResponse({ brightness: 100 });
    expect(result).toBe(undefined);
    expect(mockedLoggerError).toHaveBeenCalledTimes(1);
  });
});
