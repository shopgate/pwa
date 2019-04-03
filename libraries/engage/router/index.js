/** @module router */
import {
  getCurrentRoute as getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
} from '@shopgate/pwa-common/helpers/router';

// ACTIONS
export * from '@shopgate/pwa-common/actions/router/historyPop';
export * from '@shopgate/pwa-common/actions/router/historyPush';
export * from '@shopgate/pwa-common/actions/router/historyRedirect';
export * from '@shopgate/pwa-common/actions/router/historyReplace';
export * from '@shopgate/pwa-common/actions/router/historyReset';

// COLLECTIONS
export { default as authRoutes } from '@shopgate/pwa-common/collections/AuthRoutes';
export { default as redirects } from '@shopgate/pwa-common/collections/Redirects';

// HELPERS
export {
  getCurrentRouteHelper,
  router,
  history,
  parseQueryStringToObject,
  parseObjectToQueryString,
};

// SELECTORS
export * from '@shopgate/pwa-common/selectors/router';

// STREAMS
export * from '@shopgate/pwa-common/streams/router';
