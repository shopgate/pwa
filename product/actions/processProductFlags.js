import { getProductVariants } from './getProductVariants';
import { getProductOptions } from './getProductOptions';

/**
 * Processes the flags of a product and requests additional data if necessary.
 * @param {Object} product A single product.
 * @returns {Function} A redux thunk.
 */
const processProductFlags = product => (dispatch) => {
  const { id, flags = {} } = product;
  const {
    hasVariants = false,
    hasOptions = false,
   } = flags;

  if (hasVariants) {
    dispatch(getProductVariants(id));
  }

  if (hasOptions) {
    dispatch(getProductOptions(id));
  }
};

export default processProductFlags;
