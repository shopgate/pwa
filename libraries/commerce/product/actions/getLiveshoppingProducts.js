import getProducts from './getProducts';

/**
 * Retrieves the information for the liveshopping products widget.
 * @return {Function} A redux thunk.
 */
const getLiveshoppingProducts = () => (dispatch) => {
  dispatch(getProducts({
    pipeline: 'getLiveshoppingProducts',
    cached: false,
    includeFilters: false,
    includeSort: false,
  }));
};

export default getLiveshoppingProducts;
