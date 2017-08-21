import uniq from 'lodash/uniq';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import {
  REQUEST_CATEGORY_PRODUCTS,
  RECEIVE_CATEGORY_PRODUCTS,
  ERROR_CATEGORY_PRODUCTS,
} from '../constants';
import { PRODUCT_LIFETIME } from '../../product/constants';

/**
 * Stores a collection of product IDs by their parent's category ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const productsByCategoryId = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY_PRODUCTS: {
      let sort = DEFAULT_SORT;
      let products = null;

      if (state[action.categoryId]) {
        sort = state[action.categoryId].sort;
        products = state[action.categoryId].products;
      }

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          products: (sort === action.sort) ? products : null,
          sort: action.sort,
          isFetching: true,
          expires: 0,
        },
      };
    }

    case RECEIVE_CATEGORY_PRODUCTS: {
      const { products } = state[action.categoryId];
      const nextProducts = action.products || [];

      /**
       * If there are no previous products and no incoming products
       * its set to null, otherwise it will be an array of the previous and the
       * new products. Duplicates are removed.
       */
      const stateProducts = (products || nextProducts.length) ? uniq([
        ...(products || []),
        ...nextProducts.map(product => product.id),
      ]) : [];

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          products: stateProducts,
          totalProductCount: action.totalProductCount,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    }

    case ERROR_CATEGORY_PRODUCTS:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: false,
        },
      };

    default:
      return state;
  }
};

export default productsByCategoryId;
