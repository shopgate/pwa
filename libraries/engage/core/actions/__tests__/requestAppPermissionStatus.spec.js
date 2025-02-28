import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_ID_PUSH,
} from '@shopgate/engage/core/constants';
import { appPermissionStatusReceived } from '../../action-creators';
import requestAppPermissionStatus from '../requestAppPermissionStatus';

jest.mock('@shopgate/pwa-core/commands/appPermissions', () => ({
  getAppPermissions: jest.fn(),
}));

/**
 * @param {string} status The desired permission status.
 * @returns {Array}
 */
const getPermissionsResponse = (status = PERMISSION_STATUS_GRANTED) => [{ status }];

const permissionId = PERMISSION_ID_PUSH;

describe('engage > core > actions > requestAppPermissionStatus', () => {
  const dispatch = jest.fn((result) => {
    if (typeof result === 'function') {
      return result(dispatch);
    }

    return result;
  });

  beforeAll(() => {
    getAppPermissions.mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_GRANTED));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with PERMISSION_STATUS_GRANTED', async () => {
    const result = await dispatch(requestAppPermissionStatus({
      permissionId,
    }));

    expect(result).toEqual({ status: PERMISSION_STATUS_GRANTED });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_GRANTED,
    }));
  });

  it('should fallback to PERMISSION_STATUS_NOT_SUPPORTED when command response is an empty array', async () => {
    getAppPermissions
      .mockResolvedValueOnce([]);

    const result = await dispatch(requestAppPermissionStatus({
      permissionId,
    }));

    expect(result).toEqual({ status: PERMISSION_STATUS_NOT_SUPPORTED });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_SUPPORTED,
    }));
  });

  it('should fallback to PERMISSION_STATUS_NOT_SUPPORTED when command response is empty', async () => {
    getAppPermissions
      .mockResolvedValueOnce();

    const result = await dispatch(requestAppPermissionStatus({
      permissionId,
    }));

    expect(result).toEqual({ status: PERMISSION_STATUS_NOT_SUPPORTED });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_SUPPORTED,
    }));
  });
});
