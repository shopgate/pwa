import fetchHighlightProducts from './fetchHighlightProducts';
import fetchProducts from './fetchProducts';
import fetchProductsById from './fetchProductsById';

/**
 * Dispatches other actions based on the query type.
 * @param {number|string} type The query type.
 * @param {string} value The value to use with the query.
 * @param {Object} options Any additional options for requesting products.
 * @param {string} [id=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const fetchProductsByQuery = (type, value, options = {}, id = null) => (dispatch) => {
  /**
   * Remove all properties from the options which are just intended to be used inside this function
   * and not supposed to be used for the actual products request.
   */
  const {
    useProductHashForProductIds = false,
    ...sanitizedOptions
  } = options;

  switch (type) {
    // Product highlights
    case 1: {
      const params = {
        ...sanitizedOptions,
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
        ...sanitizedOptions,
      };

      return dispatch(fetchProducts({
        params,
        ...id && { id },
        includeFilters: false,
      }));
    }

    // Product ID's
    case 4: {
      /**
       * By default the productIds query type bypasses the regular product request logic. It will
       * just request the products that are not available in Redux yet.
       * This can cause update issues in the UI, since selectors might not return fresh data when
       * Redux changes.
       * So when the "useProductHashForProductIds" flag is active, the regular request system is
       * used and whenever the fetch params change, new product data fill be fetched.
       *
       * ATTENTION: To make the system work completely, also the "getProductsResult" selector helper
       * needs to be called with this parameter.
       */
      if (useProductHashForProductIds) {
        const params = {
          productIds: value,
          ...sanitizedOptions,
        };

        // Limit and offset are not fully supported for product requests with productId list
        delete params.limit;
        delete params.offset;

        dispatch(fetchProducts({
          params,
          ...id && { id },
          includeFilters: false,
        }));
      } else {
        dispatch(fetchProductsById(value, id));
      }

      break;
    }

    // Category
    case 5: {
      const params = {
        categoryId: value,
        ...sanitizedOptions,
      };

      return dispatch(fetchProducts({
        params,
        ...id && { id },
        includeFilters: false,
      }));
    }
    default:
  }
  return null;
};

export default fetchProductsByQuery;
