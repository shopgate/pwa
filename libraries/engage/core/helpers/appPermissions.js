import {
  COMMAND_GET_APP_PERMISSIONS,
  COMMAND_REQUEST_APP_PERMISSIONS,
} from '@shopgate/pwa-core/constants/AppCommands';

import {
  STATUS_NOT_DETERMINED,
  STATUS_GRANTED,
  STATUS_DENIED,
  PERMISSION_ID_LOCATION,
} from '@shopgate/pwa-core/constants/AppPermissions';

import geolocationRequestBrowser from '../classes/GeolocationRequestBrowser';

/**
 * Mapping of states from the browser permissions API to app permissions.
 */
const permissionsApiStateMapping = {
  prompt: STATUS_NOT_DETERMINED,
  granted: STATUS_GRANTED,
  denied: STATUS_DENIED,
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
  let state = STATUS_GRANTED;
  let geolocation;
  try {
    geolocation = await geolocationRequestBrowser.dispatch();
  } catch ({ code = null }) {
    if (code !== null) {
      state = STATUS_DENIED;
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
  fallbackStatus = STATUS_GRANTED
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

    if (permissionId === PERMISSION_ID_LOCATION && geolocationState?.state) {
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
export const createMockedPermissions = (fallbackStatus = STATUS_GRANTED) =>
  (commandName, commandParams) => mockedPermissions(commandName, commandParams, fallbackStatus);
