import event from '@shopgate/pwa-core/classes/Event';
import { logger } from '@shopgate/pwa-core/helpers';
import logGroup from '@shopgate/pwa-core/helpers/logGroup';
import {
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedSetLibVersion,
  mockedDispatch,
} from '@shopgate/pwa-core/classes/AppCommand';

import instance, { GeolocationRequestApp } from '../GeolocationRequestApp';
import {
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_TIMEOUT,
  GEOLOCATION_DEFAULT_TIMEOUT,
} from '../../constants/geolocationRequest';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  addCallback: jest.fn(),
}));
jest.mock('@shopgate/pwa-core/helpers/logGroup', () => jest.fn());
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

let getTimeResult = 0;
/* eslint-disable require-jsdoc, class-methods-use-this */
global.Date = class {
  getTime() {
    return getTimeResult;
  }
};
/* eslint-enable require-jsdoc, class-methods-use-this */

const mockResponse = {
  accuracy: 25,
  latitude: 50.4330,
  longitude: 8.67447,
};

describe('GeolocationRequestApp', () => {
  beforeEach(() => {
    getTimeResult = 0;
    instance.responseQueue = [];
  });

  it('should export a class instance as default', () => {
    expect(instance).toBeInstanceOf(GeolocationRequestApp);
    expect(instance.responseQueue).toEqual([]);
    expect(event.addCallback).toHaveBeenCalledTimes(1);
    expect(event.addCallback).toHaveBeenCalledWith('setLocation', instance.handleResponse);
  });

  describe('.dispatch()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should dispatch a command and prepare a handler for the response', async () => {
      expect.assertions(11);

      instance.dispatch()
        .then((result) => {
          expect(mockedSetCommandName).toHaveBeenCalled();
          expect(mockedSetCommandName).toHaveBeenLastCalledWith('getLocation');
          expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
          expect(mockedSetLibVersion).toHaveBeenLastCalledWith('1.0');
          expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
          expect(mockedSetCommandParams).toHaveBeenLastCalledWith({
            timeout: GEOLOCATION_DEFAULT_TIMEOUT / 1000,
          });
          expect(mockedDispatch).toHaveBeenCalledTimes(1);
          expect(instance.responseQueue).toHaveLength(0);
          expect(logGroup).toHaveBeenCalledTimes(2);
          expect(result).toEqual(mockResponse);
        });

      expect(instance.responseQueue).toHaveLength(1);
      await instance.handleResponse(mockResponse);
    });

    it('should dispatch a command with a custom timeout', () => {
      const timeout = 1000;

      const result = instance.dispatch(timeout);
      expect(result).toBeInstanceOf(Promise);
      expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandParams).toHaveBeenLastCalledWith({
        timeout: timeout / 1000,
      });
    });

    it('should handle two parallel requests as expected', async () => {
      expect.assertions(5);

      const mockResponseTwo = {
        ...mockResponse,
        accuracy: 10,
      };

      // Prepare two requests
      const requestOne = instance.dispatch();
      const requestTwo = instance.dispatch();

      // Check if the queue looks like expected
      expect(instance.responseQueue).toHaveLength(2);

      requestOne
        .then((result) => {
          expect(instance.responseQueue).toHaveLength(1);
          expect(result).toEqual(mockResponse);
        });

      requestTwo
        .then((result) => {
          expect(instance.responseQueue).toHaveLength(0);
          expect(result).toEqual(mockResponseTwo);
        });

      // Simulate incoming of the first event
      await instance.handleResponse(mockResponse);
      await instance.handleResponse(mockResponseTwo);
    });

    it('should reject with GEOLOCATION_ERROR_DENIED when the event response is empty', async () => {
      expect.assertions(2);

      instance.dispatch()
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.code).toBe(GEOLOCATION_ERROR_DENIED);
        });

      await instance.handleResponse();
    });

    it('should reject with GEOLOCATION_ERROR_TIMEOUT when the event response is empty after the timeout', async () => {
      expect.assertions(2);
      instance.dispatch()
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.code).toBe(GEOLOCATION_ERROR_TIMEOUT);
        });

      getTimeResult = GEOLOCATION_DEFAULT_TIMEOUT + 1;
      await instance.handleResponse();
    });

    it('should handle incoming events which did not have a dispatch', () => {
      const result = instance.handleResponse(mockResponse);
      expect(result).toBe(undefined);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});
