/** @module user */
import { REGISTER_PATH, LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

// ACTIONS
export { default as fetchRegisterUrl } from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
export { default as fetchUser } from '@shopgate/pwa-common/actions/user/fetchUser';
export { default as login } from '@shopgate/pwa-common/actions/user/login';
export { default as logout } from '@shopgate/pwa-common/actions/user/logout';

// CONSTANTS
export * from '@shopgate/pwa-common/constants/Registration';
export * from '@shopgate/pwa-common/constants/user';
export { REGISTER_PATH, LOGIN_PATH };

// SELECTORS
export * from '@shopgate/pwa-common/selectors/user';
export * from './selectors/login';

// STREAMS
export * from '@shopgate/pwa-common/streams/user';
