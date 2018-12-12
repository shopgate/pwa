import * as pipelines from '../constants/Pipelines';
import fetchProducts from './fetchProducts';

/**
 * Retrieves the information for the liveshopping products widget.
 * @return {Function} A redux thunk.
 */
const fetchLiveshoppingProducts = () => (dispatch) => {
  dispatch(fetchProducts({
    pipeline: pipelines.SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
    cached: false,
    includeFilters: false,
    includeSort: false,
  }));
};

export default fetchLiveshoppingProducts;
