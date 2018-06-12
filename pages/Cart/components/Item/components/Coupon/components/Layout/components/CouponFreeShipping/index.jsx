import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';

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
    <span><I18n.Text string="cart.free_shipping" /></span>
  );
};

CouponFreeShipping.propTypes = {
  freeShipping: PropTypes.bool,
};

CouponFreeShipping.defaultProps = {
  freeShipping: false,
};

export default CouponFreeShipping;
