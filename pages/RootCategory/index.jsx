import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import CategoryList from 'Components/CategoryList';
import View from 'Components/View';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const RootCategory = ({ categories }) => (
  <View>
    {categories && <CategoryList categories={categories} />}
  </View>
);

RootCategory.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

RootCategory.defaultProps = {
  categories: null,
};

export default connect(shouldUpdate((prev, next) => (
  !prev.categories && next.categories
))(RootCategory));
