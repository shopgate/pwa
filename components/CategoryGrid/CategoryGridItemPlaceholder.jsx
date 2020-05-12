import React from 'react';
import PropTypes from 'prop-types';
import { Placeholder, Image } from '@shopgate/engage/components';
import classNames from 'classnames';

import {
  gridItem,
  gridItemInner,
  gridItemColumnLeft,
  gridItemColumnRight,
  placeholder,
  categoryImage,
} from './style';

/**
 * The CategoryGridItemPlaceholder component
 * @returns {JSX}
 */
const CategoryGridItemPlaceholder = ({ showImages }) => (
  <li className={gridItem}>
    <div className={gridItemInner}>
      <div className={classNames(gridItemColumnLeft, placeholder)}>
        <Placeholder height="25px" width="80%" />
      </div>
      { showImages && (
        <div className={gridItemColumnRight}>
          <Image className={categoryImage} />
        </div>
      )}
    </div>
  </li>
);

CategoryGridItemPlaceholder.propTypes = {
  showImages: PropTypes.bool,
};

CategoryGridItemPlaceholder.defaultProps = {
  showImages: true,
};

export default CategoryGridItemPlaceholder;
