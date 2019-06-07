const mocks = require('./mockedSwatches');

const sets = ['colors', 'images'];

/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => {
  if (!context.config.enableMocks) {
    return { products };
  }

  return {
    products: products.map((product) => {
      if (Math.random() > 0.5) {
        return product;
      }

      if (!product) {
        return product;
      }

      // eslint-disable-next-line no-param-reassign
      product.characteristics = [];

      // eslint-disable-next-line no-plusplus
      for (let j = 1; j < Math.floor(Math.random() * 4) + 1; j++) {
        const set = sets[Math.floor(Math.random() * sets.length)];
        product.characteristics.push({
          id: `swatch-${j}`,
          label: `Swatch - ${j}`,
          swatch: true,
          values: Array(Math.floor(Math.random() * 10) + 1).fill(null).map((v, i) => ({
            id: `swatch-item-${i}`,
            label: `Swatch item ${i}`,
            swatch: mocks[set][Math.floor(Math.random() * mocks[set].length)],
          })),
        });
      }
      return product;
    }),
  };
};
