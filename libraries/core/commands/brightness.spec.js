import {
  setBrightness,
  resetBrightness,
  getCurrentBrightness,
} from './brightness';

import {
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedSetLibVersion,
  mockedDispatch,
} from '../classes/AppCommand';

jest.mock('../classes/AppCommand');

let mockedDispatchRejection = false;
const mockedBrightnessRequestDispatch = jest.fn();
jest.mock('../classes/BrightnessRequest', () => ({
  dispatch() {
    mockedBrightnessRequestDispatch();
    return !mockedDispatchRejection ? Promise.resolve(100) : Promise.reject(new Error('W00t'));
  },
}));

const mockedLoggerError = jest.fn();
jest.mock('../helpers', () => ({
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

      expect(mockedSetCommandName.mock.calls.length).toBe(1);
      expect(mockedSetCommandName.mock.calls[0][0]).toBe('setBrightness');
      expect(mockedSetCommandParams.mock.calls.length).toBe(1);
      expect(mockedSetCommandParams.mock.calls[0][0]).toEqual({ brightness: 100 });
      expect(mockedSetLibVersion.mock.calls.length).toBe(1);
      expect(mockedSetLibVersion.mock.calls[0][0]).toBe('17.0');
      expect(mockedDispatch.mock.calls.length).toBe(1);
    });

    it('should set the brightness to 80', () => {
      setBrightness(80);

      expect(mockedSetCommandName.mock.calls.length).toBe(1);
      expect(mockedSetCommandName.mock.calls[0][0]).toBe('setBrightness');
      expect(mockedSetCommandParams.mock.calls.length).toBe(1);
      expect(mockedSetCommandParams.mock.calls[0][0]).toEqual({ brightness: 80 });
      expect(mockedSetLibVersion.mock.calls.length).toBe(1);
      expect(mockedSetLibVersion.mock.calls[0][0]).toBe('17.0');
      expect(mockedDispatch.mock.calls.length).toBe(1);
    });
  });

  describe('resetBrightness()', () => {
    it('should work as expected', () => {
      resetBrightness();

      expect(mockedSetCommandName.mock.calls.length).toBe(1);
      expect(mockedSetCommandName.mock.calls[0][0]).toBe('resetBrightness');
      expect(mockedSetCommandParams.mock.calls.length).toBe(0);
      expect(mockedSetLibVersion.mock.calls.length).toBe(1);
      expect(mockedSetLibVersion.mock.calls[0][0]).toBe('17.0');
      expect(mockedDispatch.mock.calls.length).toBe(1);
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
