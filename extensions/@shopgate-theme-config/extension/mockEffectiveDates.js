/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => ({
  products: products.map((product) => {
    // eslint-disable-next-line no-param-reassign
    product.startDate = new Date(new Date().getTime() + 10000).toISOString();
    // eslint-disable-next-line no-param-reassign
    product.endDate = new Date(new Date().getTime() + 120000).toISOString();
    // eslint-disable-next-line no-param-reassign
    product.stock.info = 'Available in 2-3 days';
    return product;
  }),
});
