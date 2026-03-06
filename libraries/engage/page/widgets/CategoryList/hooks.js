import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { camelCase } from 'lodash';
import { getCategory } from '@shopgate/pwa-common-commerce/category/selectors';
import { fetchCategoryOrRootCategories } from '@shopgate/engage/category/actions';
import { useWidget } from '@shopgate/engage/page/hooks';
import { getCategoriesById } from './selectors';

/**
 * @typedef {Object} CategoryListWidgetConfig
 * @property {string} category The parent category ID to display categories for.
 * @property {'relevance' | 'nameAsc' | 'nameDesc'} [sort] The sort order for categories
 * @property {boolean} [showImages] Whether to display images for categories.
 * @property {boolean} [showHeadline] Whether to show the headline.
 * @property {Object} [headline] The headline to be displayed.
 */

const EMPTY_ARRAY = [];

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
  const dispatch = useDispatch();

  const {
    category,
    sort = 'relevance',
    showImages,
    showHeadline = false,
    headline,
  } = config;

  // Get the parent category object from the selected category
  const parentCategory = useSelector(state =>
    (category ? getCategory(state, { categoryId: category }) : null));

  // Get category children of the selected category (pipeline handles sorting)
  const categories = useSelector(state =>
    (typeof category === 'string' ? getCategoriesById(state, { categoryId: category }) : null));

  const sortedCategories = useMemo(() => {
    if (!categories) {
      return EMPTY_ARRAY;
    }

    /** @type {CategoryListWidgetConfig['sort']} */
    const sortCC = camelCase(sort);

    if (sortCC === 'nameAsc' || sortCC === 'nameDesc') {
      const dir = sortCC === 'nameAsc' ? 1 : -1;

      return [...categories].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) * dir);
    }

    return categories;
  }, [categories, sort]);

  useEffect(() => {
    dispatch(fetchCategoryOrRootCategories(category));
  }, [category, dispatch]);

  return {
    parentCategory,
    showImages,
    categories: sortedCategories,
    showHeadline,
    headline,
  };
};
