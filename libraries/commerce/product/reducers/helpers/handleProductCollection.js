import { PRODUCT_LIFETIME } from '../../constants';

/**
 * Builds state entries from a collection of products (Array).
 * @param {Array} products A products collection.
 * @return {Object} The product entries for the state.
 */
const handleProductCollection = (products) => {
  if (!Array.isArray(products)) {
    return {};
  }

  return products.reduce((currentProducts, productData) => ({
    ...currentProducts,
    [productData.id]: {
      productData,
      isFetching: false,
      expires: Date.now() + PRODUCT_LIFETIME,
    },
  }), {});
};

export default handleProductCollection;
