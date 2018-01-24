/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import I18n from '@shopgate/pwa-common/components/I18n';
import CouponFieldIcon from './components/CouponFieldIcon';
import styles from './style';

/**
 * The Coupon Field Layout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Layout = props => (
  <div className={styles.wrapper}>
    <form className={styles.container} onSubmit={props.handleAddCoupon}>
      <label className={styles.label} htmlFor="coupon-code-field" style={props.labelStyle}>
        <I18n.Text string="cart.redeem_coupon" />
      </label>

      <Input
        className={styles.input}
        disabled={props.isLoading}
        name="coupon-code-field"
        onFocusChange={props.handleFocusChange}
        onChange={props.handleValueChange}
        value={props.value}
      />

      <div
        style={props.iconStyle}
        className={styles.icon}
        aria-hidden
        onClick={props.handleAddCoupon}
      >
        <CouponFieldIcon disabled={props.isButtonDisabled} />
      </div>
      <div className={styles.underlineWrapper}>
        <div className={`${styles.underline} ${(!props.isFocused || props.isLoading) ? styles.underlineBlurred : ''}`} />
      </div>
    </form>
  </div>
);

Layout.propTypes = {
  handleAddCoupon: PropTypes.func,
  handleFocusChange: PropTypes.func,
  handleValueChange: PropTypes.func,
  iconStyle: PropTypes.shape(),
  isButtonDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  isLoading: PropTypes.bool,
  labelStyle: PropTypes.shape(),
  value: PropTypes.string,
};

Layout.defaultProps = {
  handleAddCoupon: () => {},
  handleFocusChange: () => {},
  handleValueChange: () => {},
  iconStyle: null,
  isButtonDisabled: false,
  isFocused: false,
  isLoading: false,
  labelStyle: null,
  value: '',
};

export default Layout;
