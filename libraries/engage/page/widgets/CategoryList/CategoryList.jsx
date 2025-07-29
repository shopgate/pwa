import React from 'react';
import { CategoryList } from '@shopgate/engage/category/components';
import { useCategoryListWidget } from './hooks';

/**
 * The CategoryListWidget is used to display category lists.
 * @returns {JSX.Element}
 */
const CategoryListWidget = () => {
  const {
    parentCategory,
    categories,
    showImages,
  } = useCategoryListWidget();

  return (
    <CategoryList
      categories={categories}
      parentCategory={parentCategory}
      showImages={showImages}
    />
  );
};

export default CategoryListWidget;
