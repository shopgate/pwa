import { ID_LOCATION } from '../constants/AppPermissions';
import {
  TYPE_GET,
  TYPE_REQUEST,
  triggerDispatchError,
  mockedPermissionsArray,
  mockedSetType,
  mockedSetPermissionIds,
  mockedDispatch,
} from '../classes/AppPermissionsRequest';

import {
  getAppPermissions,
  requestAppPermissions,
} from './appPermissions';

jest.mock('../classes/AppPermissionsRequest');

describe('App permissions commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppPermissions()', () => {
    it('should dispatch a request for all permissions', async () => {
      const permissions = await getAppPermissions();

      expect(permissions).toEqual(mockedPermissionsArray);
      expect(mockedSetType).toHaveBeenCalledTimes(1);
      expect(mockedSetType).toHaveBeenLastCalledWith(TYPE_GET);
      expect(mockedSetPermissionIds).toHaveBeenCalledTimes(1);
      expect(mockedSetPermissionIds).toHaveBeenLastCalledWith([]);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch a request for a single permission', async () => {
      const permissionIds = [ID_LOCATION];
      const permissions = await getAppPermissions(permissionIds);
      /**
       * Actually all permissions are returned here,
       * but for those tests the command doen't have to be accurate.
       */
      expect(permissions).toEqual(mockedPermissionsArray);
      expect(mockedSetType).toHaveBeenCalledTimes(1);
      expect(mockedSetType).toHaveBeenLastCalledWith(TYPE_GET);
      expect(mockedSetPermissionIds).toHaveBeenCalledTimes(1);
      expect(mockedSetPermissionIds).toHaveBeenLastCalledWith(permissionIds);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when something went wrong', async () => {
      const errorMessage = 'Something went wrong';
      triggerDispatchError(true, errorMessage);

      let permissions;
      try {
        await getAppPermissions();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(errorMessage);
      }

      expect(permissions).toBeUndefined();
    });
  });

  describe('requestAppPermissions()', () => {
    it('should dispatch a request for all permissions', async () => {
      const permissions = await requestAppPermissions();

      expect(permissions).toEqual(mockedPermissionsArray);
      expect(mockedSetType).toHaveBeenCalledTimes(1);
      expect(mockedSetType).toHaveBeenLastCalledWith(TYPE_REQUEST);
      expect(mockedSetPermissionIds).toHaveBeenCalledTimes(1);
      expect(mockedSetPermissionIds).toHaveBeenLastCalledWith([]);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch a request for a single permission', async () => {
      const permissionIds = [ID_LOCATION];
      const permissions = await requestAppPermissions(permissionIds);
      /**
       * Actually all permissions are returned here,
       * but for those tests the command doen't have to be accurate.
       */
      expect(permissions).toEqual(mockedPermissionsArray);
      expect(mockedSetType).toHaveBeenCalledTimes(1);
      expect(mockedSetType).toHaveBeenLastCalledWith(TYPE_REQUEST);
      expect(mockedSetPermissionIds).toHaveBeenCalledTimes(1);
      expect(mockedSetPermissionIds).toHaveBeenLastCalledWith(permissionIds);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when something went wrong', async () => {
      const errorMessage = 'Something went wrong';
      triggerDispatchError(true, errorMessage);

      let permissions;
      try {
        await requestAppPermissions();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(errorMessage);
      }

      expect(permissions).toBeUndefined();
    });
  });
});
