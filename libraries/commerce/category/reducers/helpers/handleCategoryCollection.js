import { CATEGORY_LIFETIME } from '../../constants';

/**
 * Builds state entries from a collection of categories.
 * @param {Array} collection A category collection.
 * @return {Object} The category entries for the state.
 */
const handleCategoryCollection = (collection) => {
  const categoryObjects = {};
  // Is used to set them all to the same date because they arrived at the same time.
  const expires = Date.now() + CATEGORY_LIFETIME;

  if (!collection) {
    return categoryObjects;
  }

  collection.forEach((category) => {
    const { ...categoryData } = category;

    categoryObjects[category.id] = {
      ...categoryData,
      isFetching: false,
      expires,
    };
  });

  return categoryObjects;
};

export default handleCategoryCollection;
