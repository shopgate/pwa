import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
// Import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
// Import Products from './components/Products';
// Import Empty from './components/Empty';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Category = ({ category, title }) => {
  const id = category ? category.id : null;

  return (
    <View title={title}>
      {/* CATEGORY LIST */}
      <Portal name={portals.CATEGORY_LIST_BEFORE} props={{ categoryId: id }} />
      <Portal name={portals.CATEGORY_LIST} props={{ categoryId: id }}>
        <CategoryList />
      </Portal>
      <Portal name={portals.CATEGORY_LIST_AFTER} props={{ categoryId: id }} />
    </View>
  );
};

Category.propTypes = {
  category: PropTypes.shape(),
  // HasProducts: PropTypes.bool,
  // IsFilterBarShown: PropTypes.bool,
  // IsRoot: PropTypes.bool,
  title: PropTypes.string,
};

Category.defaultProps = {
  category: null,
  // HasProducts: false,
  // IsFilterBarShown: true,
  // IsRoot: true,
  title: null,
};

export default connect(Category);
