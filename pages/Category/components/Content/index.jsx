import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Bar from '../Bar';
import ProductsContent from '../ProductsContent';
import Empty from '../Empty';
import CategoryListContent from '../CategoryListContent';
import connect from './connector';

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const CategoryContent = ({ categoryId, hasChildren, hasProducts }) => (
  <Fragment>
    {(!hasChildren && hasProducts) && <Bar />}
    <CategoryListContent categoryId={categoryId} />
    <ProductsContent categoryId={categoryId} hasProducts={hasProducts} />
    <Empty
      categoryId={categoryId}
      headlineText="category.no_result.heading"
      bodyText="category.no_result.body"
    />
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
