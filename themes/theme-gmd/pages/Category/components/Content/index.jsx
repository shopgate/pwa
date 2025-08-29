import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ProductFilters } from '@shopgate/engage/product/components';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
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
  // Show filter logic for old services
  let showFilters = hasProducts && !hasChildren;
  // Show filter logic for new services
  if (hasNewServices()) {
    showFilters = hasProducts;
  }

  return (
    <Fragment>
      <AppBar filtersShown={hasProducts} categoryId={categoryId} />
      <ProductFilters
        categoryId={categoryId}
        hasSubcategories={hasChildren}
        showFilters={showFilters}
      />
      <SurroundPortals portalName={VIEW_CONTENT}>
        <CategoryListContent categoryId={categoryId} />

        <ProductsContent categoryId={categoryId} hasProducts={hasProducts} />
        <Empty
          categoryId={categoryId}
          headlineText="category.no_result.heading"
          bodyText="category.no_result.body"
        />
      </SurroundPortals>
    </Fragment>
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
