import React from 'react';
import PropTypes from 'prop-types';
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
const CategoryGrid = ({ categories, prerender, showImages }) => {
  if (!categories || !categories.length) {
    if (prerender === 0) {
      return null;
    }

    return (
      <ul className={grid}>
        { Array(prerender).fill('').map((val, index) => {
          const key = `placeholder-${index}`;
          return <CategoryGridItemPlaceholder key={key} showImages={showImages} />;
        })}
      </ul>
    );
  }

  return (
    <ul className={grid}>
      {categories.map(category => (
        <CategoryGridItem key={category.id} category={category} showImages={showImages} />
      ))}
    </ul>
  );
};

CategoryGrid.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  prerender: PropTypes.number,
  showImages: PropTypes.bool,
};

CategoryGrid.defaultProps = {
  categories: null,
  prerender: 0,
  showImages: true,
};

export default CategoryGrid;
