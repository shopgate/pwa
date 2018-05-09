import {
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_CAMERA,
  USAGE_ALWAYS,
} from '../../../constants/AppPermissions';

export const mockedSetPermissionIds = jest.fn();
export const mockedDispatch = jest.fn();

export const mockedPermissionsResponse = [
  {
    permissionId: PERMISSION_ID_LOCATION,
    options: {
      usage: USAGE_ALWAYS,
    },
  }, {
    permissionId: PERMISSION_ID_CAMERA,
  },
];

let dispatchError = false;
let errorMessage = '';

/**
 * Causes that the dispatch method resolves with FALSE.
 * @param {string} message The error message.
 * @param {boolean} value Trigger an error or not.
 */
export const triggerDispatchError = (message = 'W00t', value = true) => {
  dispatchError = value;
  errorMessage = message;
};

const mockedGetAppPermissionsRequest = jest.fn()
  .mockImplementation(function GetAppPermissionsRequest() {
    this.setPermissionIds = (...args) => {
      mockedSetPermissionIds(...args);
      return this;
    };

    this.dispatch = async (...args) => {
      mockedDispatch(...args);

      if (dispatchError) {
        // Get the message before it's reset
        const message = errorMessage;
        triggerDispatchError('', false);
        throw new Error(message);
      }

      return mockedPermissionsResponse;
    };

    return this;
  });

export default mockedGetAppPermissionsRequest;

