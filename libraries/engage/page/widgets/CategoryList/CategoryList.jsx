import React from 'react';
import { CategoryList } from '@shopgate/engage/category/components';
import { useCategoryListWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

/**
 * The CategoryListWidget is used to display category lists.
 * @returns {JSX.Element}
 */
const CategoryListWidget = () => {
  const {
    parentCategory,
    categories,
    showImages,
    showHeadline,
    headline,
  } = useCategoryListWidget();

  if (!categories) {
    return null;
  }

  return (
    <>
      {(showHeadline && headline) ? (
        <WidgetHeadline headline={headline} />
      ) : null}
      <CategoryList
        categories={categories}
        parentCategory={parentCategory}
        showLeftSideImages={showImages}
      />
    </>
  );
};

export default CategoryListWidget;
