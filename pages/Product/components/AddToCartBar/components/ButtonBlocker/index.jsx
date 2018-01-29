/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

/**
 * The ButtonBlocker component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ButtonBlocker = ({ cartProductCount }) => (
  <div className={cartProductCount ? styles.transform : styles.base} />
);

ButtonBlocker.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default connect(ButtonBlocker);
