import { PROVIDE_PRODUCT } from '../constants';

/**
 * @param {string} productId .
 * @return {Object}.
 */
const provideProduct = productId => ({
  type: PROVIDE_PRODUCT,
  productId,
});

export default provideProduct;
