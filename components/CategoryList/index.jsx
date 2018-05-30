import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import List from 'Components/List';

/**
 * The category list component.
 * @param {Array} categories The categories to display.
 * @returns {JSX}
 */
const CategoryList = ({ categories }) => {
  if (!categories || !categories.length) {
    return null;
  }

  return (
    <List>
      {categories.map(category => (
        <Portal
          key={category.id}
          name={portals.CATEGORY_ITEM}
          props={{ categoryId: category.id }}
        >
          <List.Item
            link={`${CATEGORY_PATH}/${bin2hex(category.id)}`}
            title={category.name}
          />
        </Portal>
      ))}
    </List>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

CategoryList.defaultProps = {
  categories: null,
};

export default CategoryList;
