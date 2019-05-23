import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';

/**
 * The Coupon Free Shipping component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CouponFreeShipping = ({ freeShipping }) => {
  if (!freeShipping) {
    return null;
  }
  return (
    <div><I18n.Text string="cart.free_shipping" /></div>
  );
};

CouponFreeShipping.propTypes = {
  freeShipping: PropTypes.bool,
};

CouponFreeShipping.defaultProps = {
  freeShipping: false,
};

export default CouponFreeShipping;
