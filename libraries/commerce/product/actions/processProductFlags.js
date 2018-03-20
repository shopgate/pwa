import getProductVariants from './getProductVariants';
import getProductOptions from './getProductOptions';
import getProduct from './getProduct';
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
    dispatch(getProduct(baseProductId));
    dispatch(setProductId(baseProductId));
    dispatch(setProductVariantId(id));
  }

  if (hasVariants) {
    dispatch(getProductVariants(id));
  }

  if (hasOptions) {
    dispatch(getProductOptions(id));
  }

  resolve();
});

export default processProductFlags;
