import { showModal } from '@shopgate/engage/core/actions';
import { logger } from '../helpers';

import {
  PERMISSION_REQUEST_ROUTE_LOCATION,
  PERMISSION_REQUEST_ROUTE_LOCATION_BACKGROUND,
  PERMISSION_REQUEST_ROUTE_PUSH,
  PERMISSION_REQUEST_ROUTE_TRACKING,
  PERMISSION_REQUEST_ROUTE_CAMERA,
  PERMISSION_STATUS_GRANTED,
} from '../constants';
import {
  grantPushPermissions,
  grantAppTrackingTransparencyPermission,
  grantGeolocationPermissions,
  grantCameraPermissions,
} from '../actions';

/**
 * @typedef {import('redux-thunk').ThunkDispatch<
 *   import('../store').RootState,
 *   any,
 *   import('redux').AnyAction
 * >} AppDispatch
 */

/**
 * @typedef {import('../actions/grantPermissions').GrantPermissionsResult} GrantPermissionsResult
 */

/**
 * Handler for redirect collection handlers related to permission requests.
 * @param {{ action: any, dispatch: AppDispatch }} params Handler params
 */
export const permissionRouteRedirectHandler = async ({ action, dispatch }) => {
  const { route: { pathname } = {} } = action;

  /**
   * @type {GrantPermissionsResult | undefined}
   */
  let result;
  let grantedMessage;

  switch (pathname) {
    case PERMISSION_REQUEST_ROUTE_LOCATION: {
      result = await dispatch(grantGeolocationPermissions({
        useSettingsModal: true,
        resolveWithData: true,
      }));
      grantedMessage = 'permissions.accessGranted.locationMessage';
      break;
    }
    case PERMISSION_REQUEST_ROUTE_LOCATION_BACKGROUND: {
      result = await dispatch(grantGeolocationPermissions({
        useSettingsModal: true,
        requireBackgroundAccess: true,
        resolveWithData: true,
      }));
      grantedMessage = 'permissions.accessGranted.backgroundLocationMessage';
      break;
    }
    case PERMISSION_REQUEST_ROUTE_PUSH: {
      result = await dispatch(grantPushPermissions({
        useSettingsModal: true,
        resolveWithData: true,
      }));
      grantedMessage = 'permissions.accessGranted.pushMessage';
      break;
    }
    case PERMISSION_REQUEST_ROUTE_TRACKING: {
      result = await dispatch(grantAppTrackingTransparencyPermission({
        useSettingsModal: true,
        resolveWithData: true,
      }));
      grantedMessage = 'permissions.accessGranted.trackingMessage';
      break;
    }
    case PERMISSION_REQUEST_ROUTE_CAMERA: {
      result = await dispatch(grantCameraPermissions({
        useSettingsModal: true,
        resolveWithData: true,
      }));
      grantedMessage = 'permissions.accessGranted.cameraMessage';
      break;
    }
    default:
      logger.warn('Unknown permission request route', pathname);
  }

  if (result?.status === PERMISSION_STATUS_GRANTED && result?.optInRequested === false) {
    dispatch(showModal({
      message: grantedMessage,
      confirm: 'modal.ok',
      dismiss: '',
    }));
  }
};
