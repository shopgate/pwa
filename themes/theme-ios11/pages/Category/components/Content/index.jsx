import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ProductFilters } from '@shopgate/engage/product/components';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { useCategorySettings } from '@shopgate/engage/category/hooks';
import { useFilterBarSettings } from '@shopgate/engage/product/hooks';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import SubcategoryChips from '../SubcategoryChips';
import connect from './connector';
import AppBar from '../AppBar';

/**
 * @param {Object} props The component props.
 * @param {string} props.categoryId The category id.
 * @param {boolean} props.hasChildren Whether the category has children.
 * @param {boolean} props.hasProducts Whether the category has products.
 * @returns {JSX.Element}
 */
const CategoryContent = ({ categoryId, hasChildren, hasProducts }) => {
  const { layout, showImages, showAllProducts } = useCategorySettings();
  const { showSubcategoryChips, showOnParentCategories } = useFilterBarSettings();

  const showFilters = hasProducts && (!hasChildren || showOnParentCategories || hasNewServices());
  const showChips = showSubcategoryChips && hasChildren && hasProducts;

  return (
    <>
      <AppBar hasProducts={hasProducts} hasChildren={hasChildren} categoryId={categoryId} />
      <ProductFilters
        categoryId={categoryId}
        hasSubcategories={hasChildren}
        showFilters={showFilters}
        contentBefore={showChips
          ? (
            <SubcategoryChips
              categoryId={categoryId}
              showImages={showImages}
              showAllProducts={showAllProducts}
            />
          )
          : null}
      />
      <SurroundPortals portalName={VIEW_CONTENT}>
        <CategoryListContent
          categoryId={categoryId}
          layout={layout}
          showImages={showImages}
          showAllProducts={showAllProducts}
          showList={!showChips}
        />

        <ProductsContent categoryId={categoryId} hasProducts={hasProducts} />
        <Empty
          categoryId={categoryId}
          headlineText="category.no_result.heading"
          bodyText="category.no_result.body"
        />
      </SurroundPortals>
    </>
  );
};

CategoryContent.propTypes = {
  categoryId: PropTypes.string.isRequired,
  hasChildren: PropTypes.bool,
  hasProducts: PropTypes.bool,
};

CategoryContent.defaultProps = {
  hasChildren: false,
  hasProducts: false,
};

export default connect(CategoryContent);
