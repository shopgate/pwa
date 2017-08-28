/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import CrossIcon from 'Components/icons/CrossIcon';
import styles from './style';

/**
 * The Cross Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const CrossButton = ({ onClear }) => (
  <button className={styles.cross} onClick={onClear}>
    <CrossIcon className={styles.crossIcon} />
  </button>
);

CrossButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};

export default CrossButton;
