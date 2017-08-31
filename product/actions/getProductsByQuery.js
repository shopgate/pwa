import { getHighlightProducts } from './getHighlightProducts';
import getProducts from './getProducts';
import getProductsById from './getProductsById';

/**
 * Dispatches other actions based on the query type.
 * @param {string} type The query type.
 * @param {string} value The value to use with the query.
 * @param {Object} options Any additional options for requesting products.
 * @param {string} [id=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const getProductsByQuery = (type, value, options = {}, id = null) => (dispatch) => {
  switch (type) {
    // Product highlights
    case 1: {
      const params = {
        ...options,
      };

      dispatch(getHighlightProducts({
        params,
        ...id && { id },
      }));
      break;
    }

    // Search phrase
    case 2:
    case 3: {
      const params = {
        searchPhrase: value,
        ...options,
      };

      dispatch(getProducts({
        params,
        ...id && { id },
      }));
      break;
    }

    // Product ID's
    case 4: {
      dispatch(getProductsById(value, id));
      break;
    }

    // Category
    case 5: {
      const params = {
        categoryId: value,
        ...options,
      };

      dispatch(getProducts({
        params,
        ...id && { id },
      }));
      break;
    }
    default:
  }
};

export default getProductsByQuery;
