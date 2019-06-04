/**
 * Returns default configuration if request failed.
 * @param {Object[]} products products
 * @returns {Object[]}
 */
module.exports = products => products.map((product) => {
  // eslint-disable-next-line no-param-reassign
  product.price.info = 'Price info';
  // eslint-disable-next-line no-param-reassign
  product.stock.minOrderQuantity = 3;
  // eslint-disable-next-line no-param-reassign
  product.stock.maxOrderQuantity = 10;
  return product;
});
