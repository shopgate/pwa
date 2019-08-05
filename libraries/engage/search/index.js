/** @module search */

// ACTIONS
export { default as fetchSearchResults } from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
export { default as fetchSearchSuggestions } from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/search/constants/index';
export * from '@shopgate/pwa-common-commerce/search/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/search/constants/Portals';

// HELPERS
export { default as removeHighlightingPlaceholers } from '@shopgate/pwa-common-commerce/search/helpers/removeHighlightingPlaceholders';
export * from '@shopgate/pwa-common-commerce/search/helpers';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/search/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/search/streams';
