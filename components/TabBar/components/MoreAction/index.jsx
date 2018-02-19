/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { MORE_PATH } from 'Pages/More/constants';
import MoreIcon from 'Components/icons/MoreIcon';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(MORE_PATH);
  link.open();
};

/**
 * Renders the tab bar more action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarMoreAction = props => (
  <TabBarAction
    {...props}
    icon={(
      <Portal name="tabbar.more-icon">
        <MoreIcon className={styles} />
      </Portal>
    )}
    onClick={handleClick}
  />
);

TabBarMoreAction.propTypes = TabBarAction.propTypes;
TabBarMoreAction.defaultProps = TabBarAction.defaultProps;

export default TabBarMoreAction;
