import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import SideNavigationCategoriesItem from './SideNavigationCategoriesItem';

/**
 * The SideNavigationCategoriesItemChildren component.
 * @param {Object} props The component props.
 * @param {Array} props.subcategories The list of subcategories.
 * @param {number} props.level The current nesting level.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigationCategoriesItemChildren = ({ subcategories, level }) => (
  <ul>
    {subcategories.map(category => (
      <SideNavigationCategoriesItem
        key={category.id}
        level={level}
        categoryId={category.id}
      />
    ))}
  </ul>
);

SideNavigationCategoriesItemChildren.propTypes = {
  level: PropTypes.number.isRequired,
  subcategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
};

export default SideNavigationCategoriesItemChildren;
