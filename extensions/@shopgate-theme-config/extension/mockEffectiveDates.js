/**
 * Returns default configuration if request failed.
 * @param {Object} products products
 * @returns {Object[]}
 */
module.exports = products => products.map((product, i) => ({
  ...product,
  ...(i % 5 === 0) && {
    startDate: new Date(new Date().getTime() + 10000).toISOString(),
    endDate: new Date(new Date().getTime() + 20000).toISOString(),
    stock: {
      ...product.stock,
      info: 'Available in 2-3 days',
    },
  },
}));
