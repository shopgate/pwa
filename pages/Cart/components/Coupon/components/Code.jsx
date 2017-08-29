import React, { PropTypes } from 'react';
import { I18n } from 'Library/components';
import styles from '../style';

/**
* The CouponCode component.
* @param {Object} props The component properties.
* @returns {JSX}
*/
const CouponCode = props => (
  <div className={styles.code}>
    <I18n.Text string="cart.coupon_code" />: {props.value}
  </div>
);

CouponCode.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CouponCode;
