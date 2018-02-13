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
 * The CouponTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Title = (props) => {
  let title = props.value;

  if (!props.value) {
    title = (<I18n.Text string="cart.default_coupon_label" />);
  }

  return (
    <div className={styles}>
      {title}
    </div>
  );
};

Title.propTypes = {
  value: PropTypes.string,
};

Title.defaultProps = {
  value: '',
};

export default Title;
