export const TYPE_GET = 'mockedTypeGet';
export const TYPE_REQUEST = 'mockedTypeRequest';

export const mockedSetType = jest.fn();
export const mockedSetPermissionIds = jest.fn();
export const mockedDispatch = jest.fn();

let dispatchError = false;
let errorMessage = '';

export const mockedPermissionsArray = [{
  permissionId: 'location',
  status: 'granted',
  options: '{usage=always}',
}, {
  permissionId: 'phone',
  status: 'notDetermined',
}, {
  permissionId: 'camera',
  status: 'denied',
}];

/**
 * Causes that the dispatch method resolves with FALSE.
 * @param {boolean} value Trigger an error or not.
 * @param {string} message The error message.
 */
export const triggerDispatchError = (value = true, message = 'W00ps') => {
  dispatchError = value;
  errorMessage = message;
};

const mockedAppPermissionsRequest = jest.fn().mockImplementation(function AppPermissionsRequest() {
  this.setType = (...args) => {
    mockedSetType(...args);
    return this;
  };

  this.setPermissionIds = (...args) => {
    mockedSetPermissionIds(...args);
    return this;
  };

  this.dispatch = async (...args) => {
    mockedDispatch(...args);

    if (dispatchError) {
      // Get the message before it's reset
      const message = errorMessage;
      triggerDispatchError(false);
      throw new Error(message);
    }

    return mockedPermissionsArray;
  };

  return this;
});

export default mockedAppPermissionsRequest;
