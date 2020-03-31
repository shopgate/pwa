import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import grantGeolocationPermissions from '../grantGeolocationPermissions';
import getGeolocation from '../getGeolocation';
import { GEOLOCATION_ERROR_DENIED } from '../../constants/geolocationRequest';

const mockedPosition = {
  coords: {
    accuracy: 25,
    latitude: 50.4330,
    longitude: 8.67447,
  },
  timestamp: 1563873516224,
};

const mockedGeolocationRequestConstructor = jest.fn().mockResolvedValue(mockedPosition);
const mockedGeolocationRequestDispatch = jest.fn().mockResolvedValue(mockedPosition);

jest.mock('@shopgate/pwa-core/helpers', () => ({
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));
jest.mock('../grantGeolocationPermissions', () => jest.fn().mockResolvedValue(true));
jest.mock('../../classes/GeolocationRequest', () => class Foo {
  // eslint-disable-next-line require-jsdoc, extra-rules/potential-point-free
  constructor(...args) {
    mockedGeolocationRequestConstructor(...args);
  }

  // eslint-disable-next-line require-jsdoc, class-methods-use-this
  dispatch() {
    return mockedGeolocationRequestDispatch();
  }
});

describe('engage > core > actions > grantCameraPermissions', () => {
  const dispatch = jest.fn(action => action);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve the with current position', async () => {
    const position = await getGeolocation()(dispatch);
    expect(position).toBe(mockedPosition);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(grantGeolocationPermissions).toHaveBeenCalledTimes(1);
    expect(grantGeolocationPermissions).toHaveBeenCalledWith({});
    expect(mockedGeolocationRequestDispatch).toHaveBeenCalledTimes(1);
    expect(mockedGeolocationRequestConstructor).toHaveBeenCalledWith(!hasSGJavaScriptBridge());
  });

  it('should pass through the options to the grantGeolocationPermissions action call', async () => {
    const options = {
      useSettingsModal: true,
      modal: {
        message: 'Modal message',
        confirm: 'Confirm label',
      },
    };

    await expect(getGeolocation(options)(dispatch)).resolves.toBe(mockedPosition);
    expect(grantGeolocationPermissions).toHaveBeenCalledWith(options);
  });

  it('should reject with an error when permissions are not granted', async () => {
    grantGeolocationPermissions.mockResolvedValueOnce(false);
    expect.assertions(5);

    try {
      await getGeolocation()(dispatch);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(GEOLOCATION_ERROR_DENIED);
      expect(grantGeolocationPermissions).toHaveBeenCalledTimes(1);
      expect(mockedGeolocationRequestDispatch).not.toHaveBeenCalled();
      expect(mockedGeolocationRequestConstructor).not.toHaveBeenCalled();
    }
  });

  it('should reject with an error when permissions are not granted', async () => {
    hasSGJavaScriptBridge.mockResolvedValueOnce(false);
    mockedGeolocationRequestDispatch.mockRejectedValueOnce(new Error());
    expect.assertions(4);

    try {
      await getGeolocation()(dispatch);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(grantGeolocationPermissions).toHaveBeenCalledTimes(1);
      expect(mockedGeolocationRequestDispatch).toHaveBeenCalledTimes(1);
      expect(mockedGeolocationRequestConstructor).toHaveBeenCalledWith(!hasSGJavaScriptBridge());
    }
  });
});
