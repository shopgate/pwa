/**
 * Returns default configuration if request failed.
 * @param {Object[]} products products
 * @returns {Object[]}
 */
module.exports = products => products.map((product) => {
  // eslint-disable-next-line no-param-reassign
  product.price.mapPricing = {
    startDate: new Date(new Date().getTime() - 3600000).toISOString(),
    endDate: new Date(new Date().getTime() + 30000).toISOString(), // +20 seconds
    price: product.price.unitPrice + 10, // +10 units
  };
  return product;
});
