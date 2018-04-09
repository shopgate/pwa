import {
  resetBrightness,
  getCurrentBrightness,
  setBrightness,
} from './brightness';

const mockedSetCommandName = jest.fn();
const mockedSetLibVersion = jest.fn();
const mockedSetCommandParams = jest.fn();
const mockedDispatch = jest.fn();

jest.mock('../classes/AppCommand', () => function() {
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
  }
  this.dispatch = (...args) => mockedDispatch(...args);

  return this;
});

let mockedSupportedPromise = new Promise(resolve => resolve());
jest.mock('../classes/Capabilities', () => ({
  isCommandSupported() {
    return mockedSupportedPromise;
  }
}));

jest.mock('../classes/BrightnessRequest', () => ({
}));

describe('Brightness commands', () => {
  describe('Fire and forget', () => {
    afterAll(() => {
      mockedSetCommandName.mockReset();
      mockedSetLibVersion.mockReset();
      mockedSetCommandParams.mockReset();
    });
    const fireAndForgetCommands = [resetBrightness, setBrightness];
    fireAndForgetCommands.forEach((func, i) => {
      it(`should dispatch a command ${func.name}`, (done) => {
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
});
