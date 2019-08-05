/**
 * Returns default configuration if request failed.
 * @param {Object[]} products products
 * @returns {Object[]}
 */
module.exports = products => [{
  ...products[0],
  id: `${products[0].id}-${Math.round(Math.random() * 1000000)}`,
  name: `${products[0].id}-ENOTFOUND`,
}].concat(products.slice(1));
