import React, { PropTypes } from 'react';
import {
  I18n,
} from 'Library/components';
import styles from '../style';

/**
 * The CouponTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponTitle = (props) => {
  let title = props.value;

  if (!props.value) {
    title = (<I18n.Text string="cart.default_coupon_label" />);
  }

  return (
    <div className={styles.title}>
      {title}
    </div>
  );
};

CouponTitle.propTypes = {
  value: PropTypes.string,
};

CouponTitle.defaultProps = {
  value: '',
};

export default CouponTitle;
