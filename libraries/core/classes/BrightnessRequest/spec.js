const mockedAddCallback = jest.fn();
jest.mock('../Event', () => ({
  addCallback(...args) {
    mockedAddCallback(...args);
  },
}));

const mockedSetCommandName = jest.fn();
const mockedSetLibVersion = jest.fn();
const mockedDispatch = jest.fn();
jest.mock('../AppCommand', () => function MockedAppCommand() {
  this.setCommandName = (...args) => mockedSetCommandName(...args);
  this.setLibVersion = (...args) => mockedSetLibVersion(...args);
  this.dispatch = (...args) => mockedDispatch(...args);
  return this;
});

const mockedError = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error(...args) {
      mockedError(...args);
    }
  },
}));

describe('BrightnessRequest', () => {
  /* eslint-disable global-require */
  const brightnessRequest = require('./index').default;
  const { BrightnessRequest } = require('./index');
  /* eslint-enable global-require */

  it('should export already instantiated class', () => {
    expect(brightnessRequest).toBeInstanceOf(BrightnessRequest);
    expect(mockedSetCommandName).toHaveBeenCalled();
    expect(mockedSetCommandName.mock.calls[0][0]).toBe('getCurrentBrightness');
    expect(mockedSetLibVersion).toHaveBeenCalled();
    expect(mockedSetLibVersion.mock.calls[0][0]).toBe('17.0');
    expect(brightnessRequest.responseEventName).toBe('currentBrightnessResponse');
    expect(brightnessRequest.responseQueue).toEqual({});
  });
  it('should dispatch a command and prepare handler for response', (done) => {
    brightnessRequest.dispatch()
      .then((result) => {
        expect(brightnessRequest.lastResponseSerial).toBe(1);
        expect(result).toBe(100);
        done();
      });
    brightnessRequest.handleResponse({ brightness: 100 });
    expect(brightnessRequest.lastRequestSerial).toBe(1);
  });
  it('should reject a promise when response is not valid', (done) => {
    const assertError = new Error('Did not reject');
    brightnessRequest.dispatch()
      .then(() => {
        throw assertError;
      })
      .catch((e) => {
        expect(e).not.toBe(assertError);
        expect(brightnessRequest.lastResponseSerial).toBe(2);
        done();
      });
    brightnessRequest.handleResponse({ brightnessFFOFOF: 100 });
    expect(brightnessRequest.lastRequestSerial).toBe(2);
  });
  it('should log cleanup and log error when response has no promise to resolve', () => {
    const serialBefore = brightnessRequest.lastResponseSerial;
    brightnessRequest.handleResponse();
    expect(mockedError).toHaveBeenCalled();
    expect(brightnessRequest.lastResponseSerial).toBe(serialBefore);
  });
});
