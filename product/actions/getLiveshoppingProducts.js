import { getProducts } from './getProducts';

/**
 * Retrieves the information for the liveshopping products widget.
 * @return {Function} A redux thunk.
 */
const getLiveshoppingProducts = () => (dispatch) => {
  dispatch(getProducts({
    pipeline: 'getLiveshoppingProducts',
    cached: false,
  }));
};

export default getLiveshoppingProducts;
