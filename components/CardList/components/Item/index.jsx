/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@shopgate/pwa-common/components/List/components/Item';
import styles from './style';

/**
 * The Card List Item component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Item = ({ children, isSelected }) => {
  if (!Children.count(children)) {
    return null;
  }

  return (
    <ListItem className={styles} isSelected={isSelected}>
      {children}
    </ListItem>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  isSelected: PropTypes.bool,
};

Item.defaultProps = {
  children: null,
  isSelected: false,
};

export default Item;
