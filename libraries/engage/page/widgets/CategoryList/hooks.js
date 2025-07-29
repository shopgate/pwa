import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useSelector } from 'react-redux';
import { getCategory, getCategoryChildren } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * @typedef {Object} CategoryListWidgetConfig
 * @property {string} category The parent category ID to display categories for.
 * @property {string} [sort] The sort order for categories
 * @property {boolean} [showImages] Whether to display images for categories.
 * @property {boolean} [showSubcategories] Whether to display subcategories.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<CategoryListWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Category List widget configuration and data.
 */
export const useCategoryListWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    category,
    sort,
    showImages,
    showSubcategories,
  } = config;

  // Get the parent category object from the selected category
  const parentCategory = useSelector(state =>
    (category ? getCategory(state, { categoryId: category }) : null));

  // Get category children of the selected category
  const categories = useSelector(state =>
    (category ? getCategoryChildren(state, { categoryId: category }) : null));

  return {
    parentCategory,
    sort: camelCase(sort),
    showImages,
    showSubcategories,
    categories,
  };
};
