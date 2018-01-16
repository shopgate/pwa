/**
 *  Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import Toast from '@shopgate/pwa-common/components/Toast';
import Message from './components/Message';
import Container from './components/Container';
import styles from './styles';

/**
 * SnackBar component.
 * @returns {function}
 */
const SnackBar = () => (
  <Toast
    message={Message}
    container={Container}
    className={styles.drawer}
  />
);

export default SnackBar;
