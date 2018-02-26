/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from 'Components/icons/HeartIcon';
import FavoritesIconBadge from './components/FavoritesIconBadge';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(FAVORITES_PATH);
  link.open();
};

/**
 * Renders the tab bar more action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarFavoritesAction = props => (
  <TabBarAction
    {...props}
    icon={(
      <Portal name="tabbar.heart-icon">
        <FavoritesIcon className={styles} />
      </Portal>
    )}
    onClick={handleClick}
  >
    <FavoritesIconBadge />
  </TabBarAction>
);

TabBarFavoritesAction.propTypes = TabBarAction.propTypes;
TabBarFavoritesAction.defaultProps = TabBarAction.defaultProps;

export default TabBarFavoritesAction;
