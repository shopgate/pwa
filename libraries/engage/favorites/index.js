/** @module favorites */

// ACTIONS
export { default as fetchFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/fetchFavorites';
export { default as fetchFavoritesLists } from '@shopgate/pwa-common-commerce/favorites/actions/fetchFavoritesList';
export { default as addFavoritesList } from '@shopgate/pwa-common-commerce/favorites/actions/addFavoritesList';
export {
  addFavorite,
  removeFavorites,
  requestSync as toggleFavorites,
  toggleFavoriteWithListChooser,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/favorites/constants/index';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
export * from './constants/Portals';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/favorites/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/favorites/streams';
