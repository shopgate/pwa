/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../style';

/**
 * The slider item component.
 * @param {Object} props The component props.
 * @param {React.Children} props.children Some content to display inside.
 * @returns {JSX}
 */
const SliderItem = props => (
  <div className={styles.sliderItem}>
    {props.children}
  </div>
);

/**
 * The slider item component prop types.
 * @type {Object}
 */
SliderItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SliderItem;
