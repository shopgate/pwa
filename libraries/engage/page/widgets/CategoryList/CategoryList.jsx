import React from 'react';
import { CategoryList } from '@shopgate/engage/category/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useCategoryListWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

const useStyles = makeStyles()(theme => ({
  headline: {
    paddingBottom: theme.spacing(0),
  },
}));

/**
 * The CategoryListWidget is used to display category lists.
 * @returns {JSX.Element}
 */
const CategoryListWidget = () => {
  const { classes } = useStyles();

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
      {(showHeadline && headline && categories.length) ? (
        <WidgetHeadline headline={headline} className={classes.headline} />
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
