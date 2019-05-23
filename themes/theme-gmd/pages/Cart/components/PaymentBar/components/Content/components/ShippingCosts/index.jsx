import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, CartTotalLine } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER,
  getShippingLine,
} from '@shopgate/engage/cart';
import CartContext from 'Pages/Cart/context';
import connect from './connector';

/**
 * @returns {JSX}
 */
const ShippingCosts = ({ shippingCost }) => (
  <CartContext.Consumer>
    {({
      currency, isLoading, isUserLoggedIn, config,
    }) => {
      const shippingLine = getShippingLine(config, isUserLoggedIn, shippingCost);

      return (
        <Fragment>
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE} />
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING}>
            {shippingLine && (
              <CartTotalLine isDisabled={isLoading} type="shipping">
                <CartTotalLine.Label
                  label={shippingLine.label}
                  showSeparator={!!shippingLine.amount}
                />
                <CartTotalLine.Amount
                  amount={shippingLine.amount}
                  currency={currency}
                />
                <CartTotalLine.Hint hint={shippingLine.hint} />
              </CartTotalLine>
            )}
          </Portal>
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER} />
        </Fragment>
      );
    }}
  </CartContext.Consumer>
);

ShippingCosts.propTypes = {
  shippingCost: PropTypes.shape({
    label: PropTypes.string,
    amount: PropTypes.number,
  }),
};

ShippingCosts.defaultProps = {
  shippingCost: null,
};

export default connect(ShippingCosts);
