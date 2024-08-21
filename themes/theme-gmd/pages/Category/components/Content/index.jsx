import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ProductFilters from 'Components/ProductFilters';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import connect from './connector';
import AppBar from '../AppBar';

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const CategoryContent = ({ categoryId, hasProducts }) => (
  <Fragment>
    <AppBar filtersShown={hasProducts} categoryId={categoryId} />
    <ProductFilters categoryId={categoryId} showFilters={hasProducts} />
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

CategoryContent.propTypes = {
  categoryId: PropTypes.string.isRequired,
  hasProducts: PropTypes.bool,
};

CategoryContent.defaultProps = {
  hasProducts: false,
};

export default connect(CategoryContent);
