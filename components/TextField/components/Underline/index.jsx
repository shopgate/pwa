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
 *  Renders the label element.
 * @param {Object} props  The component props.
 * @return {JSX}
 */
const Underline = props => (
  <div className={styles.underlineWrapper}>
    <div
      className={styles.underline}
      style={styles.underlineStyle(props.isFocused, props.hasErrorMessage)}
    />
  </div>
);

Underline.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFocused: PropTypes.bool,
};

Underline.defaultProps = {
  isFocused: false,
  hasErrorMessage: false,
};

export default Underline;
