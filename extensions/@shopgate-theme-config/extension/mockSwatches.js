const mocks = require('./mockedSwatches');

const sets = ['colors', 'images'];

/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{products: Object[]}>}
 */
module.exports = async (context, { products = [] }) => ({
  products: products.map((product, j) => {
    if (Math.random() > 0.3) {
      return product;
    }

    const set = sets[Math.floor(Math.random() * sets.length)];

    // eslint-disable-next-line no-param-reassign
    product.characteristics = [{
      id: `${j}`,
      label: `Swatch - ${j}`,
      swatch: true,
      values: Array(15).fill(null).map((v, i) => ({
        id: `${i}`,
        label: `Swatch item ${i}`,
        swatch: mocks[set][Math.floor(Math.random() * mocks[set].length)],
      })),
    }];
    return product;
  }),
});
