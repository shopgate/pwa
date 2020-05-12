import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/engage/core';
import { CATEGORY_PATH, CATEGORY_ITEM } from '@shopgate/engage/category';
import {
  Image, Link, TextLink, Portal,
} from '@shopgate/engage/components';
import {
  gridItem,
  gridItemInner,
  gridItemColumnLeft,
  gridItemColumnRight,
  categoryTitle,
  categoryDescription,
  categoryImage,
} from './style';

/**
 * The CategoryGridItem component
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CategoryGridItem = ({ category, showImages }) => (
  <Portal key={category.id} name={CATEGORY_ITEM} props={{ categoryId: category.id }}>
    <li className={gridItem}>
      <Link
        className={gridItemInner}
        href={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
        state={{
          categoryId: category.id,
          title: category.name,
        }}
      >
        <div className={gridItemColumnLeft}>
          <TextLink
            className={categoryTitle}
            href={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
            state={{
              categoryId: category.id,
              title: category.name,
            }}
          >
            {category.name}
          </TextLink>
          <div className={categoryDescription}>
            {category.description}
          </div>
        </div>
        { showImages && (
          <div className={gridItemColumnRight}>
            <Image className={categoryImage} src={category.imageUrl} />
          </div>
        )}
      </Link>
    </li>
  </Portal>
);

CategoryGridItem.propTypes = {
  category: PropTypes.shape().isRequired,
  showImages: PropTypes.bool,
};

CategoryGridItem.defaultProps = {
  showImages: true,
};

export default CategoryGridItem;
