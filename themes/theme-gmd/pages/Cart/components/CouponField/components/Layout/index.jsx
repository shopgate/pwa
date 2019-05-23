import React from 'react';
import PropTypes from 'prop-types';
import { Input, I18n } from '@shopgate/engage/components';
import CouponFieldIcon from './components/CouponFieldIcon';
import styles from './style';

/**
 * The Coupon Field Layout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Layout = props => (
  <div className={styles.wrapper}>
    <form className={styles.container} onSubmit={props.handleAddCoupon} data-test-id="couponField">
      <label className={styles.label} htmlFor="coupon-code-field" style={props.labelStyle}>
        <I18n.Text string="cart.redeem_coupon" />
      </label>

      <Input
        className={styles.input}
        disabled={props.isLoading}
        name="coupon-code-field"
        onFocusChange={props.handleFocusChange}
        onChange={props.handleValueChange}
        setRef={props.setInputRef}
        value={props.value}
      />

      <div
        data-test-id="CouponSubmitButton"
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
  setInputRef: PropTypes.func,
  value: PropTypes.string,
};

Layout.defaultProps = {
  handleAddCoupon: () => { },
  handleFocusChange: () => { },
  handleValueChange: () => { },
  iconStyle: null,
  isButtonDisabled: false,
  isFocused: false,
  isLoading: false,
  labelStyle: null,
  setInputRef: () => { },
  value: '',
};

export default Layout;
