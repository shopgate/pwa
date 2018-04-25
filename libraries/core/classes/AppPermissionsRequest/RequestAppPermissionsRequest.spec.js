import RequestAppPermissionsRequest from './RequestAppPermissionsRequest';
import {
  REQUEST_PERMISSIONS_COMMAND_NAME,
  REQUEST_PERMISSIONS_RESPONSE_EVENT_NAME,
  PERMISSION_ID_LOCATION,
  USAGE_WHEN_IN_USE,
} from '../../constants/AppPermissions';

jest.mock('../Event', () => ({}));

describe('AppPermissionsRequest', () => {
  let instance;
  let setCommandParamsSpy;

  beforeEach(() => {
    instance = new RequestAppPermissionsRequest();
    setCommandParamsSpy = jest.spyOn(instance, 'setCommandParams');
  });

  describe('.constructor()', () => {
    it('should work as expected', () => {
      expect(instance.commandName).toEqual(REQUEST_PERMISSIONS_COMMAND_NAME);
      expect(instance.eventName).toEqual(REQUEST_PERMISSIONS_RESPONSE_EVENT_NAME);
    });
  });

  describe('.setPermissions()', () => {
    it('should set command params as expected', () => {
      const permissions = [{
        permissionId: PERMISSION_ID_LOCATION,
        options: {
          usage: USAGE_WHEN_IN_USE,
        },
      }];
      const expected = { permissions };

      const result = instance.setPermissions(permissions);

      expect(result).toEqual(instance);
      expect(instance.commandParams).toEqual(expected);
      expect(setCommandParamsSpy).toHaveBeenCalledTimes(1);
      expect(setCommandParamsSpy).toHaveBeenCalledWith(expected);
    });
  });

  describe('.validateCommandParams()', () => {

  });
});
