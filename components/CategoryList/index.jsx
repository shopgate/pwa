import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import List from 'Components/List';
import connect from './connector';
import styles from './style';

/**
 * The category list component.
 * @param {Array} categories The categories to display.
 * @returns {JSX}
 */
const CategoryList = ({ categories }) => {
  if (!categories) {
    return null;
  }

  return (
    <List className={styles}>
      {categories.map(category => (
        <Portal
          key={category.id}
          name={portals.CATEGORY_ITEM}
          props={{ categoryId: category.id }}
        >
          <List.Item
            key={category.id}
            link={`/category/${bin2hex(category.id)}`}
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

export default connect(CategoryList);
