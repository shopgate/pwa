import {
  COMMAND_GET_APP_PERMISSIONS,
  COMMAND_REQUEST_APP_PERMISSIONS,
} from '../../../constants/AppCommands';

import {
  STATUS_NOT_DETERMINED,
  STATUS_GRANTED,
  STATUS_DENIED,
  PERMISSION_ID_LOCATION,
} from '../../../constants/AppPermissions';

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
  return permissionsApiStateMapping[state] || null;
};

/**
 * Determines geolocation permissions from the browser geolocation API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 * @returns {string}
 */
const getGeolocationPermissionsFromGeolocationApi = async () => {
  let state = STATUS_GRANTED;

  try {
    await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  } catch ({ code = null }) {
    if (code !== null) {
      state = STATUS_DENIED;
    }
  }

  return state;
};

/**
 * Creates mocked app permissions to support development within browser environments.
 * @param {string} commandName The name of the command for which the permissions are created
 * @param {Object} [commandParams={}] The command params.
 * @returns {Array}
 */
const createMockedPermissions = async (commandName, commandParams = {}) => {
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
    let status = STATUS_GRANTED;

    if (permissionId === PERMISSION_ID_LOCATION && geolocationState) {
      status = geolocationState;
    }

    return {
      permissionId,
      status,
    };
  });

  return result;
};

export default createMockedPermissions;
