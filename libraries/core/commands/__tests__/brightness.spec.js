import {
  setBrightness,
  resetBrightness,
  getCurrentBrightness,
} from '../brightness';
/* eslint-disable import/named */
import {
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedSetLibVersion,
  mockedDispatch,
} from '../../classes/AppCommand';
/* eslint-enable import/named */

jest.mock('../../classes/AppCommand');

let mockedDispatchRejection = false;
const mockedBrightnessRequestDispatch = jest.fn();
jest.mock('../../classes/BrightnessRequest', () => ({
  dispatch() {
    mockedBrightnessRequestDispatch();
    return !mockedDispatchRejection ? Promise.resolve(100) : Promise.reject(new Error('W00t'));
  },
}));

const mockedLoggerError = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => {
      mockedLoggerError(...args);
    },
  },
  hasSGJavaScriptBridge: () => false,
}));

describe('Brightness commands', () => {
  beforeEach(() => {
    mockedDispatchRejection = false;
    mockedSetCommandName.mockClear();
    mockedSetCommandParams.mockClear();
    mockedSetLibVersion.mockClear();
    mockedDispatch.mockClear();
    mockedBrightnessRequestDispatch.mockClear();
    mockedLoggerError.mockClear();
  });

  describe('setBrightness()', () => {
    it('should set the brightness to 100 if no parameter is passed', () => {
      setBrightness();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenLastCalledWith('setBrightness');
      expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandParams).toHaveBeenLastCalledWith({ brightness: 100 });
      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenLastCalledWith('17.0');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });

    it('should set the brightness to 80', () => {
      setBrightness(80);

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenLastCalledWith('setBrightness');
      expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandParams).toHaveBeenLastCalledWith({ brightness: 80 });
      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenLastCalledWith('17.0');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetBrightness()', () => {
    it('should work as expected', () => {
      resetBrightness();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenLastCalledWith('resetBrightness');
      expect(mockedSetCommandParams).toHaveBeenCalledTimes(0);
      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenLastCalledWith('17.0');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentBrightness()', () => {
    it('should resolve with a number', async () => {
      const brightness = await getCurrentBrightness();
      expect(brightness).toBe(100);
      expect(mockedBrightnessRequestDispatch).toHaveBeenCalledTimes(1);
    });

    it('should handle error situations', async () => {
      mockedDispatchRejection = true;
      let brightness;

      try {
        brightness = await getCurrentBrightness();
      } catch (e) {
        expect(mockedLoggerError).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toContain('W00t');
        expect(mockedBrightnessRequestDispatch).toHaveBeenCalledTimes(1);
      }

      expect(brightness).toBeUndefined();
    });
  });
});
