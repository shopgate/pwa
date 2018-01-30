/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Sheet from 'Components/Sheet';
import Content from './components/Content';
import styles from './style';

/**
 * The Payment Bar component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PaymentBar = ({ isVisible, onSize }) => (
  <Sheet isOpen={isVisible} backdrop={false} animation={styles.animation}>
    <Content onSize={onSize} />
  </Sheet>
);

PaymentBar.propTypes = {
  isVisible: PropTypes.bool,
  onSize: PropTypes.func,
};

PaymentBar.defaultProps = {
  isVisible: true,
  onSize: () => {},
};

export default PaymentBar;
