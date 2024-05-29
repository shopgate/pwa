import { hasSGJavaScriptBridge } from '../../helpers';
import {
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_STATUS_GRANTED,
} from '../../constants/AppPermissions';

import AppPermissionsRequest from './AppPermissionsRequest';

jest.mock('../AppCommandRequest');
jest.mock('../../helpers', () => ({
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));

const commandName = 'appCommand';
const eventName = 'appEvent';

describe('AppPermissionsRequest', () => {
  /**
   * @type {AppPermissionsRequest}
   */
  let instance;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new AppPermissionsRequest(commandName, eventName);
  });

  describe('basics', () => {
    const expected = [{
      permissionId: PERMISSION_ID_CAMERA,
      status: PERMISSION_STATUS_GRANTED,
    }, {
      permissionId: PERMISSION_ID_LOCATION,
      status: PERMISSION_STATUS_GRANTED,
    }];

    const params = { permissionIds: [PERMISSION_ID_CAMERA, PERMISSION_ID_LOCATION] };

    it('should use the correct lib version', () => {
      expect(instance.libVersion).toBe('18.0');
    });

    it('should log the expected messages', async () => {
      instance.setMockedResponse(expected);

      instance.setCommandParams(params);
      await instance.dispatch();

      expect(instance.logGroupSpy).toBeCalledTimes(2);
      expect(instance.logGroupSpy).toBeCalledWith(
        instance.getRequestLogTitle(),
        params,
        instance.logColor
      );

      expect(instance.logGroupSpy).toHaveBeenLastCalledWith(
        instance.getResponseLogTitle(),
        expected,
        instance.logColor
      );
    });
  });

  describe('.dispatch()', () => {
    const expected = [{
      permissionId: PERMISSION_ID_CAMERA,
      status: PERMISSION_STATUS_GRANTED,
    }, {
      permissionId: PERMISSION_ID_LOCATION,
      status: PERMISSION_STATUS_GRANTED,
    }];

    it('should call the parent dispatch when a SGJavaScriptBridge is present', async () => {
      instance.setMockedResponse(expected);
      const response = await instance.dispatch();
      expect(response).toEqual(expected);
    });

    it('should mock the response for a getAppPermissions request when no SGJavaScriptBridge is present', async () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);

      const params = { permissionIds: [PERMISSION_ID_CAMERA, PERMISSION_ID_LOCATION] };
      instance.setCommandParams(params);

      const response = await instance.dispatch();
      expect(response).toEqual(expected);
    });

    it('should mock the response for a requestAppPermissions request when no SGJavaScriptBridge is present', async () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);

      const params = {
        permissions: [{
          permissionId: PERMISSION_ID_CAMERA,
        }, {
          permissionId: PERMISSION_ID_LOCATION,
        }],
      };
      instance.setCommandParams(params);

      const response = await instance.dispatch();
      expect(response).toEqual(expected);
    });
  });
});
