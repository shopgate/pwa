/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => ({
  products: products.map((product) => {
    if (Math.floor(Math.random() * 10) > 3) {
      return product;
    }

    return {
      ...product,
      ...{
        startDate: new Date(new Date().getTime() + 10000).toISOString(),
        endDate: new Date(new Date().getTime() + 120000).toISOString(),
        stock: {
          ...product.stock,
          ...{
            info: 'Available in 2-3 days',
          },
        },
      },
    };
  }),
});
