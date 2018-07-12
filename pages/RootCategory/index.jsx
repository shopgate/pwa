import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import CategoryList from 'Components/CategoryList';
import View from 'Components/View';
import connect from './connector';
import inject from './injector';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const RootCategory = ({ categories, open }) => (
  <View>
    {(open && categories) && <CategoryList categories={categories} />}
  </View>
);

RootCategory.propTypes = {
  open: PropTypes.bool.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

RootCategory.defaultProps = {
  categories: null,
};

export default inject(connect(shouldUpdate((prev, next) => (
  (!prev.categories && next.categories) ||
  (!prev.open && next.open)
))(RootCategory)));
