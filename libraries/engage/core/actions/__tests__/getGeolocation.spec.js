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

const mockedGeolocationRequest = jest.fn().mockResolvedValue(mockedPosition);

jest.mock('../grantGeolocationPermissions', () => jest.fn().mockResolvedValue(true));
jest.mock('../../classes/GeolocationRequest', () => class Foo {
  // eslint-disable-next-line require-jsdoc, class-methods-use-this
  dispatch() {
    return mockedGeolocationRequest();
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
    expect(mockedGeolocationRequest).toHaveBeenCalledTimes(1);
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
    expect.assertions(4);

    try {
      await getGeolocation()(dispatch);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(GEOLOCATION_ERROR_DENIED);
      expect(grantGeolocationPermissions).toHaveBeenCalledTimes(1);
      expect(mockedGeolocationRequest).not.toHaveBeenCalled();
    }
  });

  it('should reject with an error when permissions are not granted', async () => {
    mockedGeolocationRequest.mockRejectedValueOnce(new Error());
    expect.assertions(3);

    try {
      await getGeolocation()(dispatch);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(grantGeolocationPermissions).toHaveBeenCalledTimes(1);
      expect(mockedGeolocationRequest).toHaveBeenCalledTimes(1);
    }
  });
});
