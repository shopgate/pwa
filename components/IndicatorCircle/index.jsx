/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import colors from 'Styles/colors';
import variables from 'Styles/variables';
import styles from './style';

/**
 * The circle indicator component.
 * @param {Object} props The component props.
 * @param {Object} props.size Width and height of the circle.
 * @param {Object} props.color Color of the circle.
 * @param {Object} props.strokeWidth Stroke width of the circle.
 * @returns {JSX}
 */
const IndicatorCircle = ({ size, color, strokeWidth }) => (
  <svg
    className={styles.spinner}
    viewBox="25 25 50 50"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className={styles.circle(color, strokeWidth)}
      cx="50" cy="50" r="20"
    />
  </svg>
);

IndicatorCircle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

IndicatorCircle.defaultProps = {
  color: colors.accent,
  size: variables.loadingIndicator.size,
  strokeWidth: variables.loadingIndicator.strokeWidth,
};

export default IndicatorCircle;
