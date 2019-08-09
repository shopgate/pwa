import GeolocationRequest, { GEOLOCATION_DEFAULT_TIMEOUT } from '../GeolocationRequest';
import {
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
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

describe('GeolocationRequest', () => {
  let instance;

  beforeEach(() => {
    jest.clearAllMocks();

    successPayload = {
      ...mockSuccessPayload,
    };

    errorPayload = null;

    instance = new GeolocationRequest();
  });

  it('should initialize the options as expected', () => {
    expect(instance.options).toEqual({
      timeout: GEOLOCATION_DEFAULT_TIMEOUT,
    });
  });

  describe('.setTimeout()', () => {
    it('should set a new timeout', () => {
      const result = instance.setTimeout(5000);
      expect(instance.options.timeout).toBe(5000);
      expect(result).toBe(instance);
    });

    it('should set the default timeout when called without a value', () => {
      instance.setTimeout(5000);
      expect(instance.options.timeout).toBe(5000);

      const result = instance.setTimeout();
      expect(instance.options.timeout).toBe(GEOLOCATION_DEFAULT_TIMEOUT);
      expect(result).toBe(instance);
    });
  });

  describe('.dispatch()', () => {
    it('should invoke getCurrentPosition() as expected', async () => {
      await instance.dispatch();

      expect(getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        instance.options
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
