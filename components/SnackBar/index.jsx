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
import ActionButton from './components/ActionButton';
import styles from './style';

/**
 * SnackBar component.
 * @returns {function}
 */
const SnackBar = () => (
  <Toast
    actionButton={ActionButton}
    className={styles.drawer}
    container={Container}
    message={Message}
  />
);

export default SnackBar;
