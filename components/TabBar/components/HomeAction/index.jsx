/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import HomeIcon from 'Components/icons/HomeIcon';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(INDEX_PATH);
  link.open();
};

/**
 * Renders the tab bar home action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarHomeAction = props => (
  <TabBarAction
    {...props}
    icon={<HomeIcon className={styles} />}
    onClick={handleClick}
  />
);

TabBarHomeAction.propTypes = TabBarAction.propTypes;
TabBarHomeAction.defaultProps = TabBarAction.defaultProps;

export default TabBarHomeAction;
