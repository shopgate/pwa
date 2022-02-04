import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { VIEW_CONTENT } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import connect from './connector';
import AppBar from '../AppBar';
import Bar from '../Bar';

/**
 * @param {Object} props props.
 * @returns {JSX}
 */
const CategoryContent = ({ categoryId, hasChildren, hasProducts }) => (
  <Fragment>
    <AppBar hasProducts={hasProducts} hasChildren={hasChildren} />
    {!hasChildren && hasProducts && <Bar /> }
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
  hasChildren: PropTypes.bool,
  hasProducts: PropTypes.bool,
};

CategoryContent.defaultProps = {
  hasChildren: false,
  hasProducts: false,
};

export default connect(CategoryContent);
