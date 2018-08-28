import {
  REQUEST_FILTERS,
  RECEIVE_FILTERS,
  ERROR_FILTERS,
} from '@shopgate/pwa-common-commerce/filter/constants';
// TODO: Remove dependency to product
import { PRODUCT_LIFETIME } from '@shopgate/pwa-common-commerce/product/constants';
import enrichFilters from './helpers/enrichFilters';

/**
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function resultsByHash(state = {}, action) {
  switch (action.type) {
    case REQUEST_FILTERS: {
      return {
        ...state,
        [action.hash]: {
          filters: null,
          isFetching: true,
          expires: 0,
        },
      };
    }
    case RECEIVE_FILTERS: {
      return {
        ...state,
        [action.hash]: {
          filters: enrichFilters(action.filters),
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    }
    case ERROR_FILTERS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
