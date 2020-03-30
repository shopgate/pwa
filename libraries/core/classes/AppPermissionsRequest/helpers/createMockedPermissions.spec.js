import {
  COMMAND_GET_APP_PERMISSIONS,
  COMMAND_REQUEST_APP_PERMISSIONS,
} from '../../../constants/AppCommands';

import {
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  STATUS_GRANTED,
  STATUS_DENIED,
  STATUS_NOT_DETERMINED,
} from '../../../constants/AppPermissions';
import createMockedPermissions from './createMockedPermissions';

/* eslint-disable extra-rules/no-single-line-objects */
const expectedDefault = [
  { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
  { permissionId: PERMISSION_ID_LOCATION, status: STATUS_GRANTED },
];
/* eslint-enable extra-rules/no-single-line-objects */

describe('Create mocked permissions helper for App permissions', () => {
  describe('Browser APIs not available', () => {
    it('should mock permissions for a getAppPermissions call', async () => {
      const params = { permissionIds: [PERMISSION_ID_CAMERA, PERMISSION_ID_LOCATION] };
      const result = await createMockedPermissions(COMMAND_GET_APP_PERMISSIONS, params);
      expect(result).toEqual(expectedDefault);
    });

    it('should mock permissions for a requestAppPermissions call', async () => {
      const params = {
        permissions: [{
          permissionId: PERMISSION_ID_CAMERA,
        }, {
          permissionId: PERMISSION_ID_LOCATION,
        }],
      };

      const result = await createMockedPermissions(COMMAND_REQUEST_APP_PERMISSIONS, params);
      expect(result).toEqual(expectedDefault);
    });
  });

  describe('Browser APIs available', () => {
    const query = jest.fn().mockResolvedValue({ state: 'prompt' });
    const getCurrentPosition = jest.fn().mockImplementation((success) => {
      success();
    });

    beforeAll(() => {
      global.navigator.permissions = { query };
      global.navigator.geolocation = { getCurrentPosition };
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getAppPermissions', () => {
      it('should not call the browser apis when no location permissions are requested', async () => {
        /* eslint-disable extra-rules/no-single-line-objects */
        const expected = [
          { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
        ];
        /* eslint-enable extra-rules/no-single-line-objects */
        const params = { permissionIds: [PERMISSION_ID_CAMERA] };
        const result = await createMockedPermissions(COMMAND_GET_APP_PERMISSIONS, params);
        expect(result).toEqual(expected);
        expect(query).not.toHaveBeenCalled();
        expect(getCurrentPosition).not.toHaveBeenCalled();
      });

      it('should mock permissions with the correct permissions api state', async () => {
        /* eslint-disable extra-rules/no-single-line-objects */
        const expected = [
          { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
          { permissionId: PERMISSION_ID_LOCATION, status: STATUS_NOT_DETERMINED },
        ];
        /* eslint-enable extra-rules/no-single-line-objects */
        const params = { permissionIds: [PERMISSION_ID_CAMERA, PERMISSION_ID_LOCATION] };
        const result = await createMockedPermissions(COMMAND_GET_APP_PERMISSIONS, params);
        expect(result).toEqual(expected);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith({ name: 'geolocation' });
        expect(getCurrentPosition).not.toHaveBeenCalled();
      });
    });

    describe('requestAppPermissions', () => {
      it('should not call the browser apis when no location permissions are requested', async () => {
        /* eslint-disable extra-rules/no-single-line-objects */
        const expected = [
          { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
        ];
        /* eslint-enable extra-rules/no-single-line-objects */
        const params = {
          permissions: [{
            permissionId: PERMISSION_ID_CAMERA,
          }],
        };
        const result = await createMockedPermissions(COMMAND_REQUEST_APP_PERMISSIONS, params);
        expect(result).toEqual(expected);
        expect(query).not.toHaveBeenCalled();
        expect(query).not.toHaveBeenCalled();
      });

      it('should mock permissions with the correct geolocation api state if permissions where granted', async () => {
        const params = {
          permissions: [{
            permissionId: PERMISSION_ID_CAMERA,
          }, {
            permissionId: PERMISSION_ID_LOCATION,
          }],
        };

        const result = await createMockedPermissions(COMMAND_REQUEST_APP_PERMISSIONS, params);
        expect(result).toEqual(expectedDefault);
        expect(getCurrentPosition).toHaveBeenCalledTimes(1);
        expect(query).not.toHaveBeenCalled();
      });

      it('should mock permissions with the correct geolocation api state if permissions where declined', async () => {
        getCurrentPosition.mockImplementationOnce((success, error) => {
          error({ code: 2 });
        });

        /* eslint-disable extra-rules/no-single-line-objects */
        const expected = [
          { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
          { permissionId: PERMISSION_ID_LOCATION, status: STATUS_DENIED },
        ];
        /* eslint-enable extra-rules/no-single-line-objects */

        const params = {
          permissions: [{
            permissionId: PERMISSION_ID_CAMERA,
          }, {
            permissionId: PERMISSION_ID_LOCATION,
          }],
        };

        const result = await createMockedPermissions(COMMAND_REQUEST_APP_PERMISSIONS, params);
        expect(result).toEqual(expected);
        expect(getCurrentPosition).toHaveBeenCalledTimes(1);
        expect(query).not.toHaveBeenCalled();
      });
    });
  });
});

