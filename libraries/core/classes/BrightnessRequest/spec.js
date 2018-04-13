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
    },
  },
}));

describe('BrightnessRequest', () => {
  /* eslint-disable global-require */
  const brightnessRequest = require('./index').default;
  const { BrightnessRequest } = require('./index');
  /* eslint-enable global-require */

  beforeEach(() => {
    // Reset the queue for each test
    brightnessRequest.responseQueue = [];
  });

  it('should export already instantiated class', () => {
    expect(brightnessRequest).toBeInstanceOf(BrightnessRequest);
    expect(mockedSetCommandName).toHaveBeenCalled();
    expect(mockedSetCommandName.mock.calls[0][0]).toBe('getCurrentBrightness');
    expect(mockedSetLibVersion).toHaveBeenCalled();
    expect(mockedSetLibVersion.mock.calls[0][0]).toBe('17.0');
    expect(brightnessRequest.responseEventName).toBe('currentBrightnessResponse');
    expect(brightnessRequest.responseQueue).toEqual([]);
  });

  it('should dispatch a command and prepare handler for response', async () => {
    brightnessRequest.dispatch()
      .then((result) => {
        expect(brightnessRequest.responseQueue.length).toBe(0);
        expect(result).toBe(100);
      });

    await brightnessRequest.handleResponse({ brightness: 100 });
  });

  it('should handle two parallel requests as expected', async () => {
    // Prepare two requests
    const requestOne = brightnessRequest.dispatch();
    const requestTwo = brightnessRequest.dispatch();

    // Check if the queue looks like expected
    expect(brightnessRequest.responseQueue.length).toBe(2);

    requestOne
      .then((result) => {
        expect(brightnessRequest.responseQueue.length).toBe(1);
        expect(result).toBe(100);
      });

    requestTwo
      .then((result) => {
        expect(brightnessRequest.responseQueue.length).toBe(0);
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

  it('should handle incoming events which did not have a dispatch', () => {
    const result = brightnessRequest.handleResponse({ brightness: 100 });
    expect(result).toBe(undefined);
    expect(mockedError.mock.calls.length).toBe(1);
  });
});
