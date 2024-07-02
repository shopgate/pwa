import GetAppPermissionsRequest from './GetAppPermissionsRequest';
import {
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_CAMERA,
} from '../../constants/AppPermissions';

const GET_PERMISSIONS_COMMAND_NAME = 'getAppPermissions';
const GET_PERMISSIONS_RESPONSE_EVENT_NAME = 'getAppPermissionsResponse';

jest.mock('../AppCommandRequest');

const permissionIds = [PERMISSION_ID_LOCATION, PERMISSION_ID_CAMERA];

describe('GetAppPermissionsRequest', () => {
  /**
   * @type {GetAppPermissionsRequest}
   */
  let instance;
  let setCommandParamsSpy;

  beforeEach(() => {
    instance = new GetAppPermissionsRequest();
    setCommandParamsSpy = jest.spyOn(instance, 'setCommandParams');
  });

  describe('.constructor()', () => {
    it('should work as expected', () => {
      expect(instance.commandName).toEqual(GET_PERMISSIONS_COMMAND_NAME);
      expect(instance.eventName).toEqual(GET_PERMISSIONS_RESPONSE_EVENT_NAME);
    });
  });

  describe('.setPermissionIds()', () => {
    it('should set command params as expected when permissions are passed', () => {
      const expected = { permissionIds };

      const result = instance.setPermissionIds(permissionIds);

      expect(result).toEqual(instance);
      expect(instance.commandParams).toEqual(expected);
      expect(setCommandParamsSpy).toHaveBeenCalledTimes(1);
      expect(setCommandParamsSpy).toHaveBeenCalledWith(expected);
    });

    it('should set command params as expected when nothing is passed', () => {
      const expected = { permissionIds: [] };

      const result = instance.setPermissionIds();

      expect(result).toEqual(instance);
      expect(instance.commandParams).toEqual(expected);
      expect(setCommandParamsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('.validateCommandParams()', () => {
    it('should return true for valid params', () => {
      instance.setPermissionIds(permissionIds);
      const result = instance.validateCommandParams();
      expect(result).toBe(true);
    });

    it('should return true for empty params', () => {
      instance.setPermissionIds();
      const result = instance.validateCommandParams();
      expect(result).toBe(true);
    });

    it('should return true when .setPermissionIds() was not called', () => {
      const result = instance.validateCommandParams();
      expect(result).toBe(true);
    });

    it('should return false when the permission ids contain invalid values', () => {
      instance.setPermissionIds(['unknown', PERMISSION_ID_LOCATION]);
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });

    it('should return false when the permission ids parameter is not an array', () => {
      instance.setPermissionIds({});
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });
  });

  describe('.dispatch()', () => {
    it('should resolve when command param validation is successful', () => {
      const mockedResponse = { mocked: 'response' };
      instance.setMockedResponse(mockedResponse);
      instance.setPermissionIds(permissionIds);
      expect(instance.dispatch()).resolves.toEqual(mockedResponse);
    });

    it('should reject when command param validation is not successful', () => {
      const mockedResponse = { mocked: 'response' };
      instance.setMockedResponse(mockedResponse);
      instance.setPermissionIds({});
      expect(instance.dispatch()).rejects.toThrow(`${GET_PERMISSIONS_COMMAND_NAME} - invalid command parameters passed`);
    });
  });
});
