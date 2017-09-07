/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The range slider handle component.
 * @param {Object} props The component properties
 * @param {boolean} props.active Whether this handle is currently touched or was recently touched.
 * @param {number} props.index The index of the handle.
 * @param {Function} props.onTouchStart The touch start event callback.
 * @param {Object} props.classNames (Optional) An additional style classes for the handle.
 * @returns {JSX}
 */
const RangeSliderHandle = ({ active, index, onTouchStart, classNames }) => (
  <div
    className={`${classNames.handleOuter} ${styles}`}
    style={{ zIndex: Number(active) || 0 }}
    onTouchStart={event => onTouchStart(event, index)}
  >
    <div className={classNames.handleInner} />
  </div>
);

RangeSliderHandle.propTypes = {
  index: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  active: PropTypes.bool,
  classNames: PropTypes.shape({}),
};

RangeSliderHandle.defaultProps = {
  active: false,
  classNames: {},
};

export default RangeSliderHandle;
