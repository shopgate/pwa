import { RESET_CURRENT_PRODUCT } from '../constants';

/**
 * Dispatches the RESET_CURRENT_PRODUCT action.
 * @return {Object} The RESET_CURRENT_PRODUCT action.
 */
const resetCurrentProduct = () => ({
  type: RESET_CURRENT_PRODUCT,
});

export default resetCurrentProduct;
