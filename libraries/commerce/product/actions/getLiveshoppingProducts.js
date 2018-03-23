import * as pipelines from '../constants/Pipelines';
import getProducts from './getProducts';

/**
 * Retrieves the information for the liveshopping products widget.
 * @return {Function} A redux thunk.
 */
const getLiveshoppingProducts = () => (dispatch) => {
  dispatch(getProducts({
    pipeline: pipelines.SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
    cached: false,
    includeFilters: false,
    includeSort: false,
  }));
};

export default getLiveshoppingProducts;
