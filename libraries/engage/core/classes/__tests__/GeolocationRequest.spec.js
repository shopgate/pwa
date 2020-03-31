import geolocationRequestBrowser from '../GeolocationRequestBrowser';
import geolocationRequestApp from '../GeolocationRequestApp';
import GeolocationRequest from '../GeolocationRequest';
import { GEOLOCATION_DEFAULT_TIMEOUT } from '../../constants/geolocationRequest';

jest.mock('../GeolocationRequestBrowser', () => ({
  dispatch: jest.fn(),
}));

jest.mock('../GeolocationRequestApp', () => ({
  dispatch: jest.fn(),
}));

describe('GeolocationRequest', () => {
  let instance;

  beforeEach(() => {
    jest.clearAllMocks();
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
    it('should use the browser request by default', async () => {
      const customTimeout = 1000;
      await instance.setTimeout(customTimeout).dispatch();
      expect(geolocationRequestBrowser.dispatch).toHaveBeenCalledTimes(1);
      expect(geolocationRequestBrowser.dispatch).toHaveBeenCalledWith(customTimeout);
      expect(geolocationRequestApp.dispatch).not.toHaveBeenCalled();
    });

    it('should use the app request when set', async () => {
      const customTimeout = 500;
      instance = new GeolocationRequest(false);
      expect(instance.useBrowserAPI).toBe(false);
      await instance.setTimeout(customTimeout).dispatch();
      expect(geolocationRequestApp.dispatch).toHaveBeenCalledTimes(1);
      expect(geolocationRequestApp.dispatch).toHaveBeenCalledWith(customTimeout);
      expect(geolocationRequestBrowser.dispatch).not.toHaveBeenCalled();
    });
  });
});
