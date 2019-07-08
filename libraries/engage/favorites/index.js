/** @module favorites */

// ACTIONS
export { default as fetchFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/fetchFavorites';
export { requestForceFavoritesBufferClear as toggleFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/favorites/constants/index';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Portals';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/favorites/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/favorites/streams';
