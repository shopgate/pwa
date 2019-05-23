/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => ({
  products: products.map((product) => {
    // eslint-disable-next-line no-param-reassign
    product.price.info = 'Price info';
    // eslint-disable-next-line no-param-reassign
    product.stock.minOrderQuantity = 3;
    // eslint-disable-next-line no-param-reassign
    product.stock.maxOrderQuantity = 10;
    return product;
  }),
});
