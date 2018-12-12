import fetchProductVariants from './fetchProductVariants';
import fetchProductOptions from './fetchProductOptions';
import fetchProduct from './fetchProduct';
import setProductId from '../action-creators/setProductId';
import setProductVariantId from '../action-creators/setProductVariantId';

/**
 * Processes the flags of a product and requests additional data if necessary.
 * @param {Object} product A single product.
 * @returns {Function} A redux thunk.
 */
const processProductFlags = product => dispatch => new Promise((resolve) => {
  const { id, flags = {}, baseProductId } = product;
  const {
    hasVariants = false,
    hasOptions = false,
  } = flags;

  // We requested data for a child product. So we have to request also the parent product
  if (baseProductId) {
    dispatch(fetchProduct(baseProductId));
    dispatch(setProductId(baseProductId));
    dispatch(setProductVariantId(id));
  }

  if (hasVariants) {
    dispatch(fetchProductVariants(id));
  }

  if (hasOptions) {
    dispatch(fetchProductOptions(id));
  }

  resolve();
});

export default processProductFlags;
