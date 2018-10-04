import configureStore from 'redux-mock-store';
import {
  FILTER_TYPE_SINGLE_SELECT,
  FILTER_TYPE_MULTISELECT,
} from '@shopgate/pwa-common-commerce/filter/constants';

const emptyState = {
  filter: {
    activeFilters: [],
    availableFilters: {},
    activeHash: null,
    temporaryFilters: {},
  },
  history: {
    pathname: '/filter',
    queryParams: {
      s: 'searchQuery',
    },
  },
};

const storeWithFilters = {
  ...emptyState,
  filter: {
    ...emptyState.filter,
    availableFilters: {
      '{"filters":{},"pipeline":"shopgate.catalog.getFilters","searchPhrase":"*"}': {
        filters: [
          {
            id: 'category',
            label: 'Category',
            source: 'factfinder',
            type: FILTER_TYPE_SINGLE_SELECT,
            url: '/filter/category',
            values: [
              {
                id: 'One',
                label: 'First',
                hits: 1,
              },
              {
                id: 'Two',
                label: 'Second',
                hits: 1000,
              },
            ],
          },
          {
            id: 'brand',
            label: 'Brand',
            source: 'factfinder',
            type: FILTER_TYPE_MULTISELECT,
            url: '/filter/brand',
            values: [
              {
                id: 'Brandone',
                label: 'Brand one',
                hits: 100,
              },
              {
                id: 'Brandtwo',
                label: 'Brand two',
                hits: 999,
              },
            ],
          },
        ],
      },
    },
    activeHash: '{"filters":{},"pipeline":"shopgate.catalog.getFilters","searchPhrase":"*"}',
  },
};

const storeWithActiveSingleSelect = {
  ...storeWithFilters,
  history: {
    ...storeWithFilters.history,
    pathname: '/filter/category',
  },
};

const storeWithActiveMultiSelect = {
  ...storeWithFilters,
  history: {
    ...storeWithFilters.history,
    pathname: '/filter/brand',
  },
};

/**
 * Returns a store with empty state.
 * @returns {Object}
 */
export function getEmptyStore() {
  return configureStore()(emptyState);
}

/**
 * Returns a store with active single selection filter.
 * @returns {Object}
 */
export function getStoreWithActiveSingleSelection() {
  return configureStore()(storeWithActiveSingleSelect);
}

/**
 * Returns a store with active multiselection filter.
 * @returns {Object}
 */
export function getStoreWithActiveMultiSelection() {
  return configureStore()(storeWithActiveMultiSelect);
}
