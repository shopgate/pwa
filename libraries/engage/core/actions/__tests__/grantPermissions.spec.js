import event from '@shopgate/pwa-core/classes/Event';
import openAppSettings from '@shopgate/pwa-core/commands/openAppSettings';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_ID_CAMERA,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
} from '@shopgate/engage/core/constants';
import {
  getAppPermissions,
  requestAppPermissions,
} from '@shopgate/pwa-core/commands/appPermissions';
import { logger } from '@shopgate/pwa-core/helpers';
import { appPermissionStatusReceived } from '../../action-creators';
import grantPermissions from '../grantPermissions';

jest.mock('@shopgate/pwa-core/classes/Event');
jest.mock('@shopgate/pwa-core/commands/openAppSettings');
jest.mock('@shopgate/pwa-core/commands/appPermissions', () => ({
  getAppPermissions: jest.fn(),
  requestAppPermissions: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => jest.fn());
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

/**
 * @param {string} status The desired permission status.
 * @returns {Array}
 */
const getPermissionsResponse = (status = PERMISSION_STATUS_GRANTED) => [{ status }];

/**
 * Flushes the promise queue.
 * @returns {Promise}
 */
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const customModalOptions = {
  message: 'Modal message',
  confirm: 'Confirm label',
  dismiss: 'Dismiss label',
  params: {
    param: 'one',
  },
};

describe('engage > core > actions > grantPermissions', () => {
  const dispatch = jest.fn((result) => {
    if (typeof result === 'function') {
      return result(dispatch);
    }

    return result;
  });
  jest.useFakeTimers();

  beforeAll(() => {
    getAppPermissions.mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_GRANTED));
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_GRANTED));
    showModal.mockResolvedValue(true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    event.removeAllListeners();
  });

  const permissionId = PERMISSION_ID_CAMERA;

  it('should resolve with TRUE when the permissions are granted', async () => {
    const granted = await grantPermissions({ permissionId })(dispatch);

    expect(granted).toBe(true);
    expect(getAppPermissions).toHaveBeenCalledWith([permissionId]);
    expect(requestAppPermissions).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_GRANTED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when called with an invalid permissionId', async () => {
    const granted = await grantPermissions({ permissionId: 'unknownId' })(dispatch);
    expect(granted).toBe(false);
    expect(getAppPermissions).not.toHaveBeenCalled();
    expect(requestAppPermissions).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should resolve with FALSE when the permissions are not supported', async () => {
    getAppPermissions
      .mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_NOT_SUPPORTED));

    const granted = await grantPermissions({ permissionId })(dispatch);
    expect(granted).toBe(false);
    expect(getAppPermissions).toHaveBeenCalledWith([permissionId]);
    expect(requestAppPermissions).not.toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_SUPPORTED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve with TRUE when the permissions where not determined, but the user granted them', async () => {
    getAppPermissions
      .mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_NOT_DETERMINED));

    const granted = await grantPermissions({ permissionId })(dispatch);
    expect(granted).toBe(true);
    expect(getAppPermissions).toHaveBeenCalledWith([permissionId]);
    expect(requestAppPermissions).toHaveBeenCalledWith([{ permissionId }]);

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_DETERMINED,
    }));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_GRANTED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the permissions where not determined, and the user denied them', async () => {
    getAppPermissions
      .mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_NOT_DETERMINED));
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_DENIED));

    const granted = await grantPermissions({ permissionId })(dispatch);
    expect(granted).toBe(false);

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_DETERMINED,
    }));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_DENIED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the permissions where not determined, and the user denied them temporary', async () => {
    getAppPermissions
      .mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_NOT_DETERMINED));
    requestAppPermissions
      .mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_NOT_DETERMINED));

    const granted = await grantPermissions({ permissionId })(dispatch);
    expect(granted).toBe(false);

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_DETERMINED,
    }));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_DETERMINED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the permissions are denied, and no settings modal is about to be shown', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_DENIED));

    const granted = await grantPermissions({ permissionId })(dispatch);
    expect(granted).toBe(false);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_DENIED,
    }));

    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the user denied to open the app settings', async () => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_DENIED));
    showModal.mockResolvedValueOnce(false);

    const granted = await grantPermissions({
      permissionId,
      useSettingsModal: true,
      modal: customModalOptions,
    })(dispatch);
    expect(granted).toBe(false);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_DENIED,
    }));

    expect(showModal).toHaveBeenCalledWith({
      title: null,
      ...customModalOptions,
    });
    expect(openAppSettings).not.toHaveBeenCalled();
    expect(event.addCallbackSpy).not.toHaveBeenCalled();
  });

  it('should resolve with FALSE when the user opened the settings, but did not grant permissions', (done) => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_DENIED));
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_DENIED));

    grantPermissions({
      permissionId,
      useSettingsModal: true,
    })(dispatch)
      .then((granted) => {
        expect(granted).toBe(false);

        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
          permissionId,
          status: PERMISSION_STATUS_DENIED,
        }));
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
          permissionId,
          status: PERMISSION_STATUS_DENIED,
        }));

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

  it('should resolve with TRUE when the user opened the settings, and granted permissions', (done) => {
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_DENIED));
    getAppPermissions.mockResolvedValueOnce(getPermissionsResponse(PERMISSION_STATUS_GRANTED));

    grantPermissions({
      permissionId,
      useSettingsModal: true,
    })(dispatch)
      .then((granted) => {
        expect(granted).toBe(true);
        expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));

        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
          permissionId,
          status: PERMISSION_STATUS_DENIED,
        }));
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(5, appPermissionStatusReceived({
          permissionId,
          status: PERMISSION_STATUS_GRANTED,
        }));
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
