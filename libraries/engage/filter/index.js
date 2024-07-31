/** @module filter */

// ACTIONS
export { default as fetchFilters } from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/filter/constants/index';
export * from '@shopgate/pwa-common-commerce/filter/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/filter/constants/Portals';

// SELECTORS
export * from '@shopgate/pwa-common-commerce/filter/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/filter/streams';

// COMPONENTS
export { default as FilterItem } from './components/FilterItem';
export { default as PriceSlider } from './components/PriceSlider';

// HELPERS
export * from './helpers';

export {
  SORT_ORDER_RELEVANCE,
  SORT_ORDER_PRICE_ASC,
  SORT_ORDER_PRICE_DESC,
  SORT_ORDER_NAME_ASC,
  SORT_ORDER_NAME_DESC,
  SORT_ORDER_RANK_ASC,
  SORT_ORDER_RANK_DESC,
  SORT_SCOPE_CATEGORY,
  SORT_SCOPE_SEARCH,
} from './constants';

export {
  makeExtendedSortOptionsSupported,
  makeGetDefaultSortOrder,
} from './selectors';
export { SortProvider } from './providers';
export { withSort } from './hocs';
export { useSort } from './hooks';
