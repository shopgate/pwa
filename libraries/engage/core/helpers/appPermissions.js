import {
  COMMAND_GET_APP_PERMISSIONS,
  COMMAND_REQUEST_APP_PERMISSIONS,
} from '@shopgate/pwa-core/constants/AppCommands';

import {
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_DENIED,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PUSH,
  PERMISSION_ID_CAMERA,
} from '@shopgate/pwa-core/constants/AppPermissions';

import geolocationRequestBrowser from '../classes/GeolocationRequestBrowser';

const MOCK_PERMISSIONS_KEY = 'sg-mocked-app-permissions';

let getMockedAppPermissions;

/**
 * In development within the browser, app permissions can be mocked by calling a global functions
 * on the MockedPermissions object. The values are persisted in local storage, so that they survive
 * reload of the PWA.
 *
 * Permissions are stored "globally" and will affect every shop.
 *
 * Example:
 * MockedAppPermissions.setGetAppPermissionsResponse('push', 'notDetermined')
 * MockedAppPermissions.setRequestAppPermissionsResponse('push', 'denied')
 *
 * The object also provides access to the relevant constants.
 *
 * Example:
 * MockedAppPermissions.ID_PUSH
 * MockedAppPermissions.STATUS_DENIED
 *
 * Complete Example:
 * MockedAppPermissions.setRequestAppPermissionsResponse(
 *   MockedAppPermissions.ID_PUSH,
 *   MockedAppPermissions.STATUS_DENIED
 * )
 */
if (process.env.NODE_ENV === 'development') {
  /**
   * Retrieves mocked app permissions from the local storage
   * @returns {Object|null}
   */
  getMockedAppPermissions = () => JSON.parse(localStorage.getItem(MOCK_PERMISSIONS_KEY));

  /**
   * Sets a single mocked app permission status from the local storage
   * @param {string} commandType Command type for which the status is set (get / request)
   * @param {string} permissionId The permissionId for which the status is set
   * @param {string} status The mocked permission status
   */
  const setMockedAppPermission = (commandType, permissionId, status) => {
    let current = getMockedAppPermissions();

    if (current === null) {
      current = {};
    }

    if (!current?.[permissionId]) {
      // Add defaults for the permissionId when not set yet
      current[permissionId] = {
        get: PERMISSION_STATUS_GRANTED,
        request: PERMISSION_STATUS_GRANTED,
      };
    }

    // Add the status to the mocked app permissions
    current[permissionId][commandType] = status;
    // Update local storage
    localStorage.setItem(MOCK_PERMISSIONS_KEY, JSON.stringify(current));
  };

  /**
   * Prepare global object in DEV environment to mock app permissions
   */
  const obj = {
    setGetAppPermissionsResponse: (permissionId, status = PERMISSION_STATUS_GRANTED) => {
      setMockedAppPermission('get', permissionId, status);
    },
    setRequestAppPermissionsResponse: (permissionId, status = PERMISSION_STATUS_GRANTED) => {
      setMockedAppPermission('request', permissionId, status);
    },
  };

  // Populate useful constants
  obj.STATUS_GRANTED = PERMISSION_STATUS_GRANTED;
  obj.STATUS_DENIED = PERMISSION_STATUS_DENIED;
  obj.STATUS_NOT_DETERMINED = PERMISSION_STATUS_NOT_DETERMINED;
  obj.STATUS_NOT_SUPPORTED = PERMISSION_STATUS_NOT_SUPPORTED;
  obj.ID_PUSH = PERMISSION_ID_PUSH;
  obj.ID_CAMERA = PERMISSION_ID_CAMERA;
  obj.ID_LOCATION = PERMISSION_ID_LOCATION;

  window.MockedAppPermissions = obj;
}

/**
 * Mapping of states from the browser permissions API to app permissions.
 */
const permissionsApiStateMapping = {
  prompt: PERMISSION_STATUS_NOT_DETERMINED,
  granted: PERMISSION_STATUS_GRANTED,
  denied: PERMISSION_STATUS_DENIED,
};

/**
 * Determines geolocation permissions from the browser permissions API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
 * @returns {string|null}
 */
const getGeolocationPermissionsFromPermissionsApi = async () => {
  let state;

  try {
    ({ state } = await navigator.permissions.query({ name: 'geolocation' }));
    // eslint-disable-next-line no-empty
  } catch (e) { }

  // When the mapping fails we return null so that the default mocked state can be applied.
  return {
    state: permissionsApiStateMapping[state] || null,
  };
};

/**
 * Determines geolocation permissions from the browser geolocation API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 * @returns {string}
 */
const getGeolocationPermissionsFromGeolocationApi = async () => {
  let state = PERMISSION_STATUS_GRANTED;
  let geolocation;
  try {
    geolocation = await geolocationRequestBrowser.dispatch();
  } catch ({ code = null }) {
    if (code !== null) {
      state = PERMISSION_STATUS_DENIED;
    }
  }

  return {
    state,
    geolocation,
  };
};

/**
 * Creates mocked app permissions to support development within browser environments.
 * @param {string} commandName The name of the command for which the permissions are created
 * @param {Object} [commandParams={}] The command params.
 * @param {string} [fallbackStatus] The status that's returned when no status could be determined.
 * @returns {Array}
 */
const mockedPermissions = async (
  commandName,
  commandParams = {},
  fallbackStatus = PERMISSION_STATUS_GRANTED
) => {
  let { permissionIds } = commandParams;
  const { permissions } = commandParams;

  if (permissions) {
    permissionIds = permissions.map(permission => permission.permissionId);
  }

  let geolocationState;

  if (permissionIds.includes(PERMISSION_ID_LOCATION)) {
    if (commandName === COMMAND_GET_APP_PERMISSIONS) {
      geolocationState = await getGeolocationPermissionsFromPermissionsApi();
    }

    if (commandName === COMMAND_REQUEST_APP_PERMISSIONS) {
      geolocationState = await getGeolocationPermissionsFromGeolocationApi();
    }
  }

  const result = permissionIds.map((permissionId) => {
    let state = fallbackStatus;
    let geolocation;
    let useLocalStorageMock = false;

    // Use mocked permissions from local storage if available
    if (typeof getMockedAppPermissions === 'function') {
      const permissionMock = getMockedAppPermissions();
      const type = commandName === COMMAND_GET_APP_PERMISSIONS ? 'get' : 'request';
      const mockValue = permissionMock?.[permissionId]?.[type];

      if (mockValue) {
        useLocalStorageMock = true;
        state = mockValue || PERMISSION_STATUS_GRANTED;
      }
    }

    if (
      !useLocalStorageMock &&
      permissionId === PERMISSION_ID_LOCATION &&
      geolocationState?.state
    ) {
      ({ state, geolocation } = geolocationState);
    }

    return {
      permissionId,
      status: state,
      ...(geolocation ? { data: geolocation } : {}),
    };
  });

  return result;
};

/**
 * Creates a function to mock app permissions.
 * @param {string} [fallbackStatus] The status that's returned when no status could be determined.
 * @returns {Function}
 */
export const createMockedPermissions = (fallbackStatus = PERMISSION_STATUS_GRANTED) =>
  (commandName, commandParams) => mockedPermissions(commandName, commandParams, fallbackStatus);
