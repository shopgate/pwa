import {
  event,
  getAppPermissions,
  requestAppPermissions,
  openAppSettings,
  STATUS_DENIED,
  STATUS_GRANTED,
  STATUS_NOT_DETERMINED,
  STATUS_NOT_SUPPORTED,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
} from '@shopgate/pwa-core';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

import grantCameraPermissions from './grantCameraPermissions';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/pwa-core/classes/Event');
jest.mock('@shopgate/pwa-core/commands/openAppSettings');
jest.mock('@shopgate/pwa-core/commands/appPermissions', () => ({
  getAppPermissions: jest.fn(),
  requestAppPermissions: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => jest.fn());

/**
 * @param {string} status The desired permission status.
 * @returns {Array}
 */
const getPermissionsResponse = (status = STATUS_GRANTED) => [{ status }];

/**
 * Flushes the promise queue.
 * @returns {Promise}
 */
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('grantCameraPermissions', () => {
  const dispatch = jest.fn(action => action);
  jest.useFakeTimers();

  beforeAll(() => {
    getAppPermissions.mockResolvedValue(getPermissionsResponse(STATUS_GRANTED));
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(STATUS_GRANTED));
    showModal.mockResolvedValue(true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    event.removeAllListeners();
  });

  it('should resolve with TRUE when the camera permissions are granted', async () => {
    const granted = await grantCameraPermissions()(dispatch);

    expect(granted).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the camera permissions are not supported', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_NOT_SUPPORTED));

    const granted = await grantCameraPermissions()(dispatch);
    expect(granted).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with TRUE when the camera permissions where not determined, but the user granted them', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_NOT_DETERMINED));

    const granted = await grantCameraPermissions()(dispatch);
    expect(granted).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the camera permissions where not determined, and the user denied them', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_NOT_DETERMINED));
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(STATUS_DENIED));

    const granted = await grantCameraPermissions()(dispatch);
    expect(granted).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the camera permissions where not determined, and the user denied them temporary', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_NOT_DETERMINED));
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(STATUS_NOT_DETERMINED));
    const granted = await grantCameraPermissions()(dispatch);
    expect(granted).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the user denied to open the app settings', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_DENIED));
    showModal.mockResolvedValueOnce(false);

    const granted = await grantCameraPermissions()(dispatch);
    expect(granted).toBe(false);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith({
      title: null,
      message: 'scanner.camera_access_denied.message',
      confirm: 'scanner.camera_access_denied.settings_button',
    });
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the user opened the settings, but did not granted permissions', (done) => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_DENIED));
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_DENIED));

    grantCameraPermissions()(dispatch)
      .then((granted) => {
        expect(granted).toBe(false);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(openAppSettings).toHaveBeenCalledTimes(1);
        expect(event.removeCallbackSpy).toHaveBeenCalledWith(
          APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
          expect.any(Function)
        );
        done();
      });

    // Flush the promise queue, so that the code inside of promise from the action is executed.
    flushPromises().then(() => {
      event.call(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);
      jest.runAllTimers();
    });
  });

  it('should resolve with TRUE when the user opened the settings,and granted permissions', (done) => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_DENIED));
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(STATUS_GRANTED));

    grantCameraPermissions()(dispatch)
      .then((granted) => {
        expect(granted).toBe(true);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(openAppSettings).toHaveBeenCalledTimes(1);
        expect(event.removeCallbackSpy).toHaveBeenCalledWith(
          APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
          expect.any(Function)
        );
        done();
      });

    // Flush the promise queue, so that the code inside of promise from the action is executed.
    flushPromises().then(() => {
      event.call(APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND);
      jest.runAllTimers();
    });
  });
});
