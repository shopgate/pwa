const mocks = require('./mockedSwatches');

const sets = ['colors', 'images'];

/**
 * Returns default configuration if request failed.
 * @param {SDKContext} context context
 * @param {Object} input input
 * @returns {Promise<{characteristics: Object[]}>}
 */
module.exports = async (context, { characteristics = [] }) => ({
  characteristics: characteristics.map((characteristic) => {
    if (!characteristic.label.toLowerCase().includes('color')) {
      return characteristic;
    }

    const set = sets[Math.floor(Math.random() * sets.length)];

    // eslint-disable-next-line no-param-reassign
    characteristic.swatch = true;

    // eslint-disable-next-line no-param-reassign
    characteristic.values = characteristic.values.map(value => ({
      ...value,
      swatch: mocks[set][Math.floor(Math.random() * mocks[set].length)],
    }));

    return characteristic;
  }),
});
