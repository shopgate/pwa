import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
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
            type: 'single_select',
            label: 'Single selection',
            value: 'SingleSelected',
          },
          MultiSelect: {
            type: 'multiselect',
            label: 'MultiSelect',
            values: ['one', 'two'],
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
