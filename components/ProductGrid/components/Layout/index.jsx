/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import styles from './style';

/**
 * The Product Grid Layout component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Layout = ({ children }) => (
  <Grid wrap className={styles.container} itemScope itemType="http://schema.org/ItemList">
    {children}
  </Grid>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
