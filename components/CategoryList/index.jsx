/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
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
      {categories.map(category =>
        <List.Item
          key={category.id}
          link={`/category/${bin2hex(category.id)}`}
          title={category.name}
        />
      )}
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
