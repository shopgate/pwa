import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { getCategory, getCategoryChildren } from '@shopgate/pwa-common-commerce/category/selectors';
import { fetchCategory } from '@shopgate/engage/category/actions';
import { useEffect, useMemo } from 'react';

/**
 * @typedef {Object} CategoryListWidgetConfig
 * @property {string} category The parent category ID to display categories for.
 * @property {string} [sort] The sort order for categories
 * @property {boolean} [showImages] Whether to display images for categories.
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
  } = config;

  const sortCC = useMemo(() => camelCase(sort), [sort]);

  // Get the parent category object from the selected category
  const parentCategory = useSelector(state =>
    (category ? getCategory(state, { categoryId: category }) : null));

  // Get category children of the selected category (pipeline handles sorting)
  const categories = useSelector(state =>
    (category ? getCategoryChildren(state, { categoryId: category }) : null));

  // TODO sort here
  useEffect(() => {
    if (category) {
      dispatch(fetchCategory(category));
    }
  }, [category, dispatch, sort, sortCC]);

  return {
    parentCategory,
    showImages,
    categories,
  };
};
