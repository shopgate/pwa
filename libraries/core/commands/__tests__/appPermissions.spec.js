import { getAppPermissions, requestAppPermissions } from '../appPermissions';
import { PERMISSION_ID_LOCATION, PERMISSION_ID_CAMERA } from '../../constants/AppPermissions';
/* eslint-disable import/named */
import {
  mockedSetPermissionIds as mockedGetSetter,
  mockedDispatch as mockedGetDispatch,
  mockedPermissionsResponse as mockedGetResponse,
  triggerDispatchError as triggerGetDispatchError,
} from '../../classes/AppPermissionsRequest/GetAppPermissionsRequest';
import {
  mockedSetPermissions as mockedRequestSetter,
  mockedDispatch as mockedRequestDispatch,
  mockedPermissionsResponse as mockedRequestResponse,
  triggerDispatchError as triggerRequestDispatchError,
} from '../../classes/AppPermissionsRequest/RequestAppPermissionsRequest';
/* eslint-enable import/named */

jest.mock('../../classes/AppPermissionsRequest/GetAppPermissionsRequest');
jest.mock('../../classes/AppPermissionsRequest/RequestAppPermissionsRequest');

describe('App Permissions commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppPermissions()', () => {
    const permissionIds = [PERMISSION_ID_LOCATION, PERMISSION_ID_CAMERA];

    it('should resolve with permissions', async () => {
      const result = await getAppPermissions(permissionIds);

      expect(result).toEqual(mockedGetResponse);
      expect(mockedGetSetter).toHaveBeenCalledTimes(1);
      expect(mockedGetSetter).toHaveBeenCalledWith(permissionIds);
      expect(mockedGetDispatch).toHaveBeenCalledTimes(1);
    });

    it('should resolve with permissions if no ids where passed', async () => {
      const result = await getAppPermissions();

      expect(result).toEqual(mockedGetResponse);
      expect(mockedGetSetter).toHaveBeenCalledTimes(1);
      expect(mockedGetSetter).toHaveBeenCalledWith([]);
      expect(mockedGetDispatch).toHaveBeenCalledTimes(1);
    });

    it('should reject with an error', async () => {
      const message = 'get W00t';
      triggerGetDispatchError(message);
      let result;

      try {
        result = await getAppPermissions(permissionIds);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(message);
      }

      expect(result).toBeUndefined();
    });
  });

  describe('requestAppPermissions()', () => {
    it('should resolve with permissions', async () => {
      const result = await requestAppPermissions(mockedRequestResponse);

      expect(result).toEqual(mockedRequestResponse);
      expect(mockedRequestSetter).toHaveBeenCalledTimes(1);
      expect(mockedRequestSetter).toHaveBeenCalledWith(mockedRequestResponse);
      expect(mockedRequestDispatch).toHaveBeenCalledTimes(1);
    });

    it('should reject with an error', async () => {
      const message = 'request W00t';
      triggerRequestDispatchError(message);
      let result;

      try {
        result = await requestAppPermissions(mockedRequestResponse);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(message);
      }

      expect(result).toBeUndefined();
    });
  });
});
