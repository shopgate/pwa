import RequestAppPermissionsRequest from './RequestAppPermissionsRequest';
import {
  PERMISSION_ID_LOCATION,
  USAGE_WHEN_IN_USE,
} from '../../constants/AppPermissions';
import { COMMAND_REQUEST_APP_PERMISSIONS } from '../../constants/AppCommands';
import { APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE } from '../../constants/AppEvents';

jest.mock('../Event', () => ({}));

const permissions = [{
  permissionId: PERMISSION_ID_LOCATION,
  options: {
    usage: USAGE_WHEN_IN_USE,
  },
}];

describe('AppPermissionsRequest', () => {
  let instance;
  let setCommandParamsSpy;

  beforeEach(() => {
    instance = new RequestAppPermissionsRequest();
    setCommandParamsSpy = jest.spyOn(instance, 'setCommandParams');
  });

  describe('.constructor()', () => {
    it('should work as expected', () => {
      expect(instance.commandName).toEqual(COMMAND_REQUEST_APP_PERMISSIONS);
      expect(instance.eventName).toEqual(APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE);
    });
  });

  describe('.setPermissions()', () => {
    it('should set command params as expected', () => {
      const expected = { permissions };

      const result = instance.setPermissions(permissions);

      expect(result).toEqual(instance);
      expect(instance.commandParams).toEqual(expected);
      expect(setCommandParamsSpy).toHaveBeenCalledTimes(1);
      expect(setCommandParamsSpy).toHaveBeenCalledWith(expected);
    });
  });

  describe('.validateCommandParams()', () => {
    it('should return true for valid params', () => {
      instance.setPermissions(permissions);
      const result = instance.validateCommandParams();
      expect(result).toBe(true);
    });

    it('should return false when .setPermissions() was not called', () => {
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });

    it('should return false when the permission array is empty', () => {
      instance.setPermissions([]);
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });

    it('should return false when the permission array contains invalid permission entry', () => {
      instance.setPermissions([null]);
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });

    it('should return false when the permission array contains invalid permissions', () => {
      instance.setPermissions([{ wrongParam: 1337 }]);
      const result = instance.validateCommandParams();
      expect(result).toBe(false);
    });
  });
});
