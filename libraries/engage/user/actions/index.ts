import logoutAction from '@shopgate/pwa-common/actions/user/logout';
import type { AppThunk, MutableFunction } from '../../core/types';

export { default as fetchRegisterUrl } from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
export { default as fetchUser } from '@shopgate/pwa-common/actions/user/fetchUser';
export { default as login } from '@shopgate/pwa-common/actions/user/login';

/**
 * Logs the user out. `notify` shows the logout modal, `autoLogout` marks a logout because the
 * session expired.
 */
export const logout = logoutAction as unknown as MutableFunction<
  (notify?: boolean, autoLogout?: boolean) => AppThunk<unknown>
>;
