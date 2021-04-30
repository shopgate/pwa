/** @module favorites */

// ACTION CREATORS
export {
  addProductToFavorites,
  removeProductFromFavorites,
} from '@shopgate/pwa-common-commerce/favorites/action-creators';

// ACTIONS
export { default as fetchFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/fetchFavorites';
export {
  addFavorite,
  removeFavorites,
  requestSync as toggleFavorites,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/favorites/constants/index';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Portals';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/favorites/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/favorites/streams';
