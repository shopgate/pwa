import instance, { GeolocationRequestBrowser } from '../GeolocationRequestBrowser';
import {
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
  GEOLOCATION_DEFAULT_TIMEOUT,
} from '../../constants/geolocationRequest';

let successPayload;
let errorPayload;

const getCurrentPosition = jest.fn().mockImplementation((successCb, errorCb) => {
  if (errorPayload) {
    errorCb(errorPayload);
    return;
  }

  successCb(successPayload);
});

global.navigator.geolocation = {
  getCurrentPosition,
};

const mockSuccessPayload = {
  coords: {
    accuracy: 25,
    latitude: 50.4330,
    longitude: 8.67447,
  },
  timestamp: 1563873516224,
};

describe('GeolocationRequestBrowser', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    successPayload = {
      ...mockSuccessPayload,
    };

    errorPayload = null;
  });

  it('should initialize as expected', () => {
    expect(instance).toBeInstanceOf(GeolocationRequestBrowser);
  });

  describe('.dispatch()', () => {
    it('should invoke getCurrentPosition() as expected', async () => {
      await instance.dispatch();

      expect(getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        { timeout: GEOLOCATION_DEFAULT_TIMEOUT }
      );
    });

    it('should resolve as expected', async () => {
      const { coords } = mockSuccessPayload;
      await expect(instance.dispatch()).resolves.toEqual({
        accuracy: coords.accuracy,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    });

    it('should reject with the expected errors', async () => {
      /**
       * @param {string} code Error code.
       * @param {string} message Error message.
       * @returns {Error}
       */
      const mockError = (code, message) => {
        const error = new Error(message);
        error.code = code;
        return error;
      };
      /* eslint-disable extra-rules/no-single-line-objects */
      errorPayload = { code: 0, message: 'One' };
      await expect(instance.dispatch()).rejects.toEqual(mockError(GEOLOCATION_ERROR_UNKNOWN, 'One'));
      errorPayload = { code: 1, message: 'Two' };
      await expect(instance.dispatch()).rejects.toEqual(mockError(GEOLOCATION_ERROR_DENIED, 'Two'));
      errorPayload = { code: 2, message: 'Three' };
      await expect(instance.dispatch()).rejects.toEqual(mockError(GEOLOCATION_ERROR_UNAVAILABLE, 'Three'));
      errorPayload = { code: 3, message: 'Four' };
      await expect(instance.dispatch()).rejects.toEqual(mockError(GEOLOCATION_ERROR_TIMEOUT, 'Four'));
      /* eslint-enable extra-rules/no-single-line-objects */
    });
  });
});
