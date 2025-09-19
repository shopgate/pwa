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
 * @property {string} [sort] The sort order for categories
 * @property {boolean} [showImages] Whether to display images for categories.
 * @property {boolean} [showHeadline] Whether to show the headline.
 * @property {Object} [headline] The headline to be displayed.
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
  const dispatch = useDispatch();

  const {
    category,
    sort,
    showImages,
    showHeadline,
    headline,
  } = config;

  const sortCC = useMemo(() => camelCase(sort), [sort]);

  // Get the parent category object from the selected category
  const parentCategory = useSelector(state =>
    (category ? getCategory(state, { categoryId: category }) : null));

  // Get category children of the selected category (pipeline handles sorting)
  const categories = useSelector(state =>
    (typeof category === 'string' ? getCategoriesById(state, { categoryId: category }) : null));

  const sortedCategories = useMemo(() => {
    if (!categories) {
      return [];
    }

    if (sortCC === 'relevance') {
      return categories;
    }
    const isAsc = sortCC === 'nameAsc';

    return [...categories].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) * (isAsc ? 1 : -1));
  }, [categories, sortCC]);

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
