import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
import connect from './connector';

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const CategoryContent = ({ categories, categoryId }) => (
  <Fragment>
    <Portal name={portals.CATEGORY_LIST_BEFORE} props={{ categoryId }} />
    <Portal name={portals.CATEGORY_LIST} props={{ categoryId }}>
      <CategoryList categories={categories} />
    </Portal>
    <Portal name={portals.CATEGORY_LIST_AFTER} props={{ categoryId }} />
  </Fragment>
);

CategoryContent.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

CategoryContent.defaultProps = {
  categories: null,
};

export default connect(CategoryContent);
