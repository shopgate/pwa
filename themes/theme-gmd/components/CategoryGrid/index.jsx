import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CategoryGridItem from './CategoryGridItem';
import CategoryGridItemPlaceholder from './CategoryGridItemPlaceholder';
import {
  grid,
} from './style';

/**
 * The CategoryGrid component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CategoryGrid = ({
  categories, prerender, showImages, className,
}) => {
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return null;
  }

  return (
    <ul className={classNames(grid, className)}>
      {categories.map(category => (
        <CategoryGridItem key={category.id} category={category} showImages={showImages} />
      ))}
    </ul>
  );
};

CategoryGrid.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  className: PropTypes.string,
  prerender: PropTypes.number,
  showImages: PropTypes.bool,
};

CategoryGrid.defaultProps = {
  categories: null,
  prerender: 0,
  showImages: true,
  className: null,
};

export default CategoryGrid;
