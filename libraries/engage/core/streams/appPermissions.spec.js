import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_ID_PUSH,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PHONE,
  PERMISSION_ID_BACKGROUND_APP_REFRESH,
} from '@shopgate/engage/core/constants';
import { appPermissionStatusReceived } from '../action-creators';
import {
  appPermissionStatusReceived$,
  appPermissionStatusPushReceived$,
  appPermissionStatusCameraReceived$,
  appPermissionStatusLocationReceived$,
  appPermissionStatusPhoneReceived$,
  appPermissionStatusBackgroundAppRefreshReceived$,
} from './appPermissions';

describe('engage > core > streams > appPermissions', () => {
  let subscriber;

  beforeEach(() => {
    subscriber = jest.fn();
  });

  describe('appPermissionStatusReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched', () => {
      appPermissionStatusReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when other actions besides appPermissionsReceived was dispatched', () => {
      appPermissionStatusReceived$.subscribe(subscriber);
      mainSubject.next({
        action: { type: 'MOCKED_ACTION' },
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('appPermissionStatusPushReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched for PERMISSION_ID_PUSH', () => {
      appPermissionStatusPushReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when appPermissionsReceived action was not dispatched for PERMISSION_ID_PUSH', () => {
      appPermissionStatusPushReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_CAMERA,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('appPermissionStatusCameraReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched for PERMISSION_ID_CAMERA', () => {
      appPermissionStatusCameraReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_CAMERA,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when appPermissionsReceived action was not dispatched for PERMISSION_ID_CAMERA', () => {
      appPermissionStatusCameraReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('appPermissionStatusLocationReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched for PERMISSION_ID_LOCATION', () => {
      appPermissionStatusLocationReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_LOCATION,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when appPermissionsReceived action was not dispatched for PERMISSION_ID_LOCATION', () => {
      appPermissionStatusLocationReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('appPermissionStatusPhoneReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched for PERMISSION_ID_PHONE', () => {
      appPermissionStatusPhoneReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PHONE,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when appPermissionsReceived action was not dispatched for PERMISSION_ID_PHONE', () => {
      appPermissionStatusPhoneReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('appPermissionStatusBackgroundAppRefreshReceived$', () => {
    it('should emit when appPermissionsReceived action was dispatched for PERMISSION_ID_BACKGROUND_APP_REFRESH', () => {
      appPermissionStatusBackgroundAppRefreshReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_BACKGROUND_APP_REFRESH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when appPermissionsReceived action was not dispatched for PERMISSION_ID_BACKGROUND_APP_REFRESH', () => {
      appPermissionStatusBackgroundAppRefreshReceived$.subscribe(subscriber);
      mainSubject.next({
        action: appPermissionStatusReceived({
          permissionId: PERMISSION_ID_PUSH,
          status: PERMISSION_STATUS_GRANTED,
        }),
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});
