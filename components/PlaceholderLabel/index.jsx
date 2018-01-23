/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * Placeholder for one line texts.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PlaceholderLabel = ({ children, className, ready, style }) => {
  if (!ready) {
    return (
      <div style={style} className={`${styles.label} ${className}`} />
    );
  }

  return children;
};

PlaceholderLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ready: PropTypes.bool,
  style: PropTypes.shape(),
};

PlaceholderLabel.defaultProps = {
  children: null,
  className: '',
  style: null,
  ready: false,
};

export default PlaceholderLabel;
