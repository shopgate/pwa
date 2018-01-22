/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The discount badge component.
 * @param {Object} props The component props
 * @param {string} [props.className] Additional CSS style definitions
 * @param {string} props.text The text contents of the component.
 * @returns {JSX}
 */
const DiscountBadge = ({ text, className, display, discount }) => (
  <I18n.Text
    className={`${styles[display]} ${className}`}
    string={text}
    params={[discount]}
  />
);

DiscountBadge.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  discount: PropTypes.number,
  display: PropTypes.oneOf(Object.keys(styles)),
};

DiscountBadge.defaultProps = {
  className: '',
  discount: null,
  display: 'small',
};

export default DiscountBadge;
