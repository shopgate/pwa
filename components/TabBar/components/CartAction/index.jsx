/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CartIcon from 'Components/icons/CartIcon';
import TabBarAction from '../TabBarAction';
import CartItemBadge from './components/CartItemBadge';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(CART_PATH);
  link.open();
};

/**
 * Renders the tab bar cart action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarCartAction = props => (
  <TabBarAction
    {...props}
    icon={(
      <Portal name="tabbar.cart-icon">
        <CartIcon className={styles} />
      </Portal>
    )}
    onClick={handleClick}
  >
    <CartItemBadge />
  </TabBarAction>
);

TabBarCartAction.propTypes = {
  ...TabBarAction.propTypes,
};
TabBarCartAction.defaultProps = TabBarAction.defaultProps;

export default TabBarCartAction;
