import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  PERMISSION_ID_PUSH,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PHONE,
  PERMISSION_ID_BACKGROUND_APP_REFRESH,
  APP_PERMISSION_STATUS_RECEIVED,
} from '@shopgate/engage/core/constants';

/**
 * Gets triggered when a permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusReceived$ = main$
  .filter(({ action }) => action.type === APP_PERMISSION_STATUS_RECEIVED);

/**
 * Gets triggered when a push permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusPushReceived$ = appPermissionStatusReceived$
  .filter(({ action }) => action.permissionId === PERMISSION_ID_PUSH);

/**
 * Gets triggered when a camera permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusCameraReceived$ = appPermissionStatusReceived$
  .filter(({ action }) => action.permissionId === PERMISSION_ID_CAMERA);

/**
 * Gets triggered when a location permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusLocationReceived$ = appPermissionStatusReceived$
  .filter(({ action }) => action.permissionId === PERMISSION_ID_LOCATION);

/**
 * Gets triggered when a phone permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusPhoneReceived$ = appPermissionStatusReceived$
  .filter(({ action }) => action.permissionId === PERMISSION_ID_PHONE);

/**
 * Gets triggered when a backgroundAppRefresh permission status was received from the app.
 * @type {Observable}
 */
export const appPermissionStatusBackgroundAppRefreshReceived$ = appPermissionStatusReceived$
  .filter(({ action }) => action.permissionId === PERMISSION_ID_BACKGROUND_APP_REFRESH);
