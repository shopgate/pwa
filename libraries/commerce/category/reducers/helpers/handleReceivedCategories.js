
/**
 * Handles the received category id's by mapping to store and returning results.
 * @param {Array} categories The received categories.
 * @returns {Array} An array of category objects.
 */
const handleReceivedCategories = categories => (
  categories.length ? categories.map(category => category.id) : null
);

export default handleReceivedCategories;
