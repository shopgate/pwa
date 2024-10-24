import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Ellipsis } from '@shopgate/engage/components';

/**
* The Coupon Code component.
* @param {Object} props The component props.
* @returns {JSX}
*/
export const CartItemCouponCode = ({ value }) => (
  <Ellipsis rows={2}>
    {`${i18n.text('cart.coupon_code')}: ${value}`}
  </Ellipsis>
);

CartItemCouponCode.propTypes = {
  value: PropTypes.string,
};

CartItemCouponCode.defaultProps = {
  value: '',
};
