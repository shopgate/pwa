import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import {
  PERMISSION_STATUS_GRANTED,
  PERMISSION_ID_PUSH,
} from '@shopgate/pwa-core/constants/AppPermissions';
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

    expect(result).toBe(PERMISSION_STATUS_GRANTED);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, appPermissionStatusReceived({
      permissionId,
      status: PERMISSION_STATUS_GRANTED,
    }));
  });
});
