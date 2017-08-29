import React, { PropTypes } from 'react';
import {
  Input,
  I18n,
} from 'Library/components';
import AddIcon from './Icon';
import styles from '../style';

/**
 * The CouponFieldLayout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponFieldLayout = props => (
  <div className={styles.wrapper}>
    <form
      className={styles.container}
      onSubmit={props.handleAddCoupon}
    >
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
        <AddIcon disabled={props.isButtonDisabled} />
      </div>
      <div className={styles.underlineWrapper}>
        <div className={`${styles.underline} ${(!props.isFocused || props.isLoading) ? styles.underlineBlurred : ''}`} />
      </div>
    </form>
  </div>
);

CouponFieldLayout.propTypes = {
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

CouponFieldLayout.defaultProps = {
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

export default CouponFieldLayout;
