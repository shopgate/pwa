/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import Item from '../Item';
import styles from './style';

/**
 * The Product List Iterator component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Iterator = props => (
  <List.Item
    key={props.id}
    itemProp="itemListElement"
    itemScope
    itemType="http://schema.org/ListItem"
    className={styles.item}
  >
    <Portal name={portals.PRODUCT_LIST_ITEM_BEFORE} props={{ id: props.id }} />
    <Portal name={portals.PRODUCT_LIST_ITEM} props={{ id: props.id }}>
      <Item product={props} display={props.display} />
    </Portal>
    <Portal name={portals.PRODUCT_LIST_ITEM_AFTER} props={{ id: props.id }} />
  </List.Item>
);

Iterator.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.shape(),
};

Iterator.defaultProps = {
  display: null,
};

export default Iterator;
