import { APP_DID_START, APP_WILL_START, WILL_REGISTER_LINK_EVENTS, DID_REGISTER_LINK_EVENTS } from '@shopgate/pwa-common/constants/ActionTypes';

// CONSTANTS
export { APP_DID_START, APP_WILL_START, WILL_REGISTER_LINK_EVENTS, DID_REGISTER_LINK_EVENTS };

// ACTIONS
export { default as handleDeepLink } from '@shopgate/pwa-common/actions/app/handleDeepLink';
export { default as handleLink } from '@shopgate/pwa-common/actions/app/handleLink';
export { default as handlePushNotification } from '@shopgate/pwa-common/actions/app/handlePushNotification';
export { default as registerLinkEvents } from '@shopgate/pwa-common/actions/app/registerLinkEvents';

// STREAMS
export * from '@shopgate/pwa-common/streams/app';
