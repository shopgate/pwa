import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import CategoryList from 'Components/CategoryList';
import FilterBar from 'Components/FilterBar';
import View from 'Components/View';
import Products from './components/Products';
import Empty from './components/Empty';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Category = ({ category, title }) => {
  return (
    <View title={title}>
      <div />
    </View>
  );
};

Category.propTypes = {
  category: PropTypes.shape(),
  hasProducts: PropTypes.bool,
  isFilterBarShown: PropTypes.bool,
  isRoot: PropTypes.bool,
  title: PropTypes.string,
};

Category.defaultProps = {
  category: null,
  hasProducts: false,
  isFilterBarShown: true,
  isRoot: true,
  title: null,
};

export default Category;
