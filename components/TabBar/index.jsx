/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import getTabActionComponentForType from './helpers/getTabActionComponentForType';
import connect from './connector';
import styles from './style';

/**
 * Renders the action for a given tab configuration.
 * @param {Object} tab The tab configuration.
 * @param {boolean} isHighlighted Whether the tab is currently highlighted.
 * @returns {JSX}
 */
const createTabAction = (tab, isHighlighted) => {
  const Action = getTabActionComponentForType(tab.type);

  return (
    <Action
      key={tab.type}
      {...tab}
      isHighlighted={isHighlighted}
    />
  );
};

/**
 * Renders the tab bar component.
 * @param {Object} props The component properties.
 * @param {boolean} props.isVisible Whether the tab bar is visible.
 * @param {Array} props.visibleTabs The visible tabs.
 * @param {string|null} props.activeTab The currently active tab name.
 * @returns {JSX}
 */
const TabBar = ({ isVisible, visibleTabs, activeTab }) => (
  isVisible ?
    <Grid className={styles}>
      {visibleTabs.map(tab => createTabAction(tab, activeTab === tab.type))}
    </Grid>
    : null
);

TabBar.propTypes = {
  visibleTabs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string,
  isVisible: PropTypes.bool,
};

TabBar.defaultProps = {
  activeTab: null,
  cartProductCount: 0,
  isVisible: true,
};

export default connect(TabBar);
