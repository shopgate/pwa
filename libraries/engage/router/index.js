/** @module router */

// ACTIONS
export { default as historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
export { default as historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
export { default as historyRedirect } from '@shopgate/pwa-common/actions/router/historyRedirect';
export { default as historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
export { default as historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

// COLLECTIONS
export { default as authRoutes } from '@shopgate/pwa-common/collections/AuthRoutes';
export { default as redirects } from '@shopgate/pwa-common/collections/Redirects';

// HELPERS
export * from '@shopgate/pwa-common/helpers/router';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/router';

// STREAMS
export * from '@shopgate/pwa-common/streams/router';
