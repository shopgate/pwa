import fetchHighlightProducts from './fetchHighlightProducts';
import fetchProducts from './fetchProducts';
import fetchProductsById from './fetchProductsById';

/**
 * Dispatches other actions based on the query type.
 * @param {string} type The query type.
 * @param {string} value The value to use with the query.
 * @param {Object} options Any additional options for requesting products.
 * @param {string} [id=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const fetchProductsByQuery = (type, value, options = {}, id = null) => (dispatch) => {
  switch (type) {
    // Product highlights
    case 1: {
      const params = {
        ...options,
      };

      dispatch(fetchHighlightProducts({
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

      dispatch(fetchProducts({
        params,
        ...id && { id },
        includeFilters: false,
      }));
      break;
    }

    // Product ID's
    case 4: {
      dispatch(fetchProductsById(value, id));
      break;
    }

    // Category
    case 5: {
      const params = {
        categoryId: value,
        ...options,
      };

      dispatch(fetchProducts({
        params,
        ...id && { id },
        includeFilters: false,
      }));
      break;
    }
    default:
  }
};

export default fetchProductsByQuery;
