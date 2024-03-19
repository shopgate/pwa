import { requestAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_SUPPORTED,
  PERMISSION_ID_PUSH,
} from '@shopgate/engage/core/constants';
import { appPermissionStatusReceived } from '../../action-creators';
import requestAppPermission from '../requestAppPermission';

jest.mock('@shopgate/pwa-core/commands/appPermissions', () => ({
  getAppPermissions: jest.fn(),
  requestAppPermissions: jest.fn(),
}));

/**
 * @param {string} status The desired permission status.
 * @returns {Array}
 */
const getPermissionsResponse = (status = PERMISSION_STATUS_GRANTED) => [{ status }];

const permissionId = PERMISSION_ID_PUSH;

describe('engage > core > actions > requestAppPermission', () => {
  const dispatch = jest.fn((result) => {
    if (typeof result === 'function') {
      return result(dispatch);
    }

    return result;
  });

  beforeAll(() => {
    requestAppPermissions.mockResolvedValue(getPermissionsResponse(PERMISSION_STATUS_GRANTED));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with PERMISSION_STATUS_GRANTED', async () => {
    const result = await dispatch(requestAppPermission({
      permissionId,
    }));

    expect(result).toBe(PERMISSION_STATUS_GRANTED);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_GRANTED,
    }));
  });

  it('should fallback to PERMISSION_STATUS_NOT_SUPPORTED when command response is an empty array', async () => {
    requestAppPermissions
      .mockResolvedValueOnce([]);

    const result = await dispatch(requestAppPermission({
      permissionId,
    }));

    expect(result).toBe(PERMISSION_STATUS_NOT_SUPPORTED);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_SUPPORTED,
    }));
  });

  it('should fallback to PERMISSION_STATUS_NOT_SUPPORTED when command response is empty', async () => {
    requestAppPermissions
      .mockResolvedValueOnce();

    const result = await dispatch(requestAppPermission({
      permissionId,
    }));

    expect(result).toBe(PERMISSION_STATUS_NOT_SUPPORTED);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_NOT_SUPPORTED,
    }));
  });
});
