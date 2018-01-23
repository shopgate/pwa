/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import styles from './style';

/**
 * The Product List Layout component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Layout = ({ children }) => (
  <List className={styles.list} itemScope itemType="http://schema.org/ItemList">
    {children}
  </List>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
