import GetAppPermissionsRequest from './GetAppPermissionsRequest';
import {
  GET_PERMISSIONS_COMMAND_NAME,
  GET_PERMISSIONS_RESPONSE_EVENT_NAME,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_CAMERA,
} from '../../constants/AppPermissions';

jest.mock('../Event', () => ({}));

describe('AppPermissionsRequest', () => {
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
    it('should set command params as expected', () => {
      const permissionIds = [PERMISSION_ID_LOCATION, PERMISSION_ID_CAMERA];
      const expected = { permissionIds };

      const result = instance.setPermissionIds(permissionIds);

      expect(result).toEqual(instance);
      expect(instance.commandParams).toEqual(expected);
      expect(setCommandParamsSpy).toHaveBeenCalledTimes(1);
      expect(setCommandParamsSpy).toHaveBeenCalledWith(expected);
    });
  });

  describe('.validateCommandParams()', () => {

  });
});
