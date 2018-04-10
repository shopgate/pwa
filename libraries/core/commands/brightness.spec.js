import {
  resetBrightness,
  getCurrentBrightness,
  setBrightness,
} from './brightness';

const mockedSetCommandName = jest.fn();
const mockedSetLibVersion = jest.fn();
const mockedSetCommandParams = jest.fn();
const mockedDispatch = jest.fn();

jest.mock('../classes/AppCommand', () => function AppCommand() {
  this.setCommandName = (...args) => {
    mockedSetCommandName(...args);
    return this;
  };
  this.setLibVersion = (...args) => {
    mockedSetLibVersion(...args);
    return this;
  };
  this.setCommandParams = (...args) => {
    mockedSetCommandParams(...args);
    return this;
  };
  this.dispatch = (...args) => mockedDispatch(...args);

  return this;
});
// Capabilities mocks.
let mockedSupportedPromiseResolution = true;
let mockedSupportedPromiseResolutionError;
jest.mock('../classes/Capabilities', () => ({
  isCommandSupported() {
    // eslint-disable-next-line no-confusing-arrow
    return new Promise((resolve, reject) => mockedSupportedPromiseResolution ?
      resolve() : reject(mockedSupportedPromiseResolutionError));
  },
}));

jest.mock('../classes/BrightnessRequest', () => ({
  dispatch() {
    return new Promise(resolve => resolve(100));
  },
}));

const mockedError = jest.fn();
jest.mock('../helpers', () => ({
  logger: {
    error(...args) {
      mockedError(...args);
    },
  },
}));

describe('Brightness commands', () => {
  const fireAndForgetCommands = [resetBrightness, setBrightness];
  describe('Fire and forget - success', () => {
    afterAll(() => {
      mockedSetCommandName.mockReset();
      mockedSetLibVersion.mockReset();
      mockedSetCommandParams.mockReset();
    });
    fireAndForgetCommands.forEach((func, i) => {
      it(`should dispatch a command ${func.name}`, (done) => {
        mockedSupportedPromiseResolution = true;
        func();
        setTimeout(() => {
          expect(mockedSetCommandName.mock.calls[i][0]).toBe(func.name);
          expect(mockedSetLibVersion.mock.calls[i][0]).toBe('17.0');
          if (func.name === 'setBrightness') {
            expect(mockedSetCommandParams).toHaveBeenCalled();
          }
          done();
        }, 0);
      });
    });
  });
  describe('Fire and forget - rejections', () => {
    afterEach(() => {
      mockedSupportedPromiseResolutionError = undefined;
      mockedError.mockReset();
    });
    fireAndForgetCommands.forEach((func) => {
      it(`should do nothing on rejection without error for ${func.name}`, (done) => {
        mockedSupportedPromiseResolution = false;
        mockedSupportedPromiseResolutionError = undefined;
        func();
        setTimeout(() => {
          expect(mockedError).not.toHaveBeenCalled();
          done();
        }, 0);
      });
      it(`should log error on rejection with error ${func.name}`, (done) => {
        mockedSupportedPromiseResolution = false;
        mockedSupportedPromiseResolutionError = new Error('Foo');
        func();
        setTimeout(() => {
          expect(mockedError).toHaveBeenCalled();
          expect(mockedError.mock.calls[0][0]).toBe(mockedSupportedPromiseResolutionError);
          done();
        }, 10);
      });
    });
  });
  describe('getCurrentBrightness', () => {
    beforeEach(() => {
      mockedError.mockReset();
    });
    afterEach(() => {
      mockedError.mockReset();
    });
    it('should resolve with a number', async () => {
      mockedSupportedPromiseResolution = true;
      try {
        const brightness = await getCurrentBrightness();
        expect(brightness).toBe(100);
      } catch (e) {
        throw e;
      }
    });
    it('should reject and log an error', async () => {
      mockedSupportedPromiseResolution = false;
      mockedSupportedPromiseResolutionError = new Error('foo');
      try {
        await getCurrentBrightness();
        throw new Error('Did not throw');
      } catch (e) {
        expect(e).toBe(mockedSupportedPromiseResolutionError);
        expect(mockedError).toHaveBeenCalled();
      }
    });
  });
});
