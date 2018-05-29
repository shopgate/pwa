import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
// Import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from './components/Products';
// Import Empty from './components/Empty';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Category = (props) => {
  const id = props.category ? props.category.id : null;

  return (
    <View>

      {/* CATEGORY LIST */}
      <Portal name={portals.CATEGORY_LIST_BEFORE} props={{ categoryId: id }} />
      <Portal name={portals.CATEGORY_LIST} props={{ categoryId: id }}>
        <CategoryList categories={props.categories} />
      </Portal>
      <Portal name={portals.CATEGORY_LIST_AFTER} props={{ categoryId: id }} />

      {/* PRODUCT LIST */}
      <Portal name={portals.PRODUCT_LIST_BEFORE} props={{ categoryId: id }} />
      <Portal name={portals.PRODUCT_LIST} props={{ categoryId: id }}>
        {props.hasProducts && <Products />}
      </Portal>
      <Portal name={portals.PRODUCT_LIST_AFTER} props={{ categoryId: id }} />

    </View>
  );
};

Category.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  category: PropTypes.shape(),
  hasProducts: PropTypes.number,
  // IsFilterBarShown: PropTypes.bool,
};

Category.defaultProps = {
  categories: null,
  category: null,
  hasProducts: 0,
  // IsFilterBarShown: true,
};

export default connect(Category);
