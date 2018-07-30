import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  FILTER_TYPE_SINGLE_SELECT,
  FILTER_TYPE_MULTISELECT,
} from '@shopgate/pwa-common-commerce/filter/constants';
import { GRID_VIEW } from '../../pages/Category/constants';

const mockedStoreDefault = {
  filter: {
    activeFilters: [],
    availableFilters: {},
    activeHash: null,
    temporaryFilters: {},
  },
  ui: {
    categoryPage: {
      viewMode: GRID_VIEW,
    },
  },
  history: {
    queryParams: {
      sort: 'desc',
    },
  },
};

const mockedStoreAllSelected = {
  ...mockedStoreDefault,
  filter: {
    ...mockedStoreDefault.filter,
    activeFilters: [
      {
        filters: {
          SingleSelect: {
            type: FILTER_TYPE_SINGLE_SELECT,
            label: 'Single selection',
            value: 'SingleSelected',
            valueLabel: 'Single Selected',
          },
          MultiSelect: {
            type: FILTER_TYPE_MULTISELECT,
            label: 'MultiSelect',
            values: ['one', 'two'],
            valueLabels: ['One', 'Two'],
          },
          Range: {
            type: 'range',
            label: 'Range',
            minimum: 1.1,
            maximum: 99.99,
          },
        },
      },
    ],
  },
};

/**
 * Returns a store with default state.
 * @returns {Object}
 */
export function getDefaultStore() {
  return configureStore([thunk])(mockedStoreDefault);
}
/**
 * Returns a store with state with all filter types selected.
 * @returns {Object}
 */
export function getStoreWithSelectedFilters() {
  return configureStore([thunk])(mockedStoreAllSelected);
}
