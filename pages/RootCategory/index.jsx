import React from 'react';
import PropTypes from 'prop-types';
import CategoryList from 'Components/CategoryList';
import View from 'Components/View';
import connect from './connector';

/**
 * The RootCategory component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RootCategory = ({ category }) => {
  const categories = (category && category.categories) ? category.categories : null;

  return (
    <View>
      <CategoryList categories={categories} />
    </View>
  );
};

RootCategory.propTypes = {
  category: PropTypes.shape(),
};

RootCategory.defaultProps = {
  category: null,
};

export default connect(RootCategory);
