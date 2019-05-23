import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, CartTotalLine } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL,
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL_BEFORE,
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL_AFTER,
} from '@shopgate/engage/cart';
import CartContext from 'Pages/Cart/context';
import connect from './connector';

/**
 * The GrandTotal component.
 * @returns {JSX}
 */
const GrandTotal = ({ amount }) => (
  <CartContext.Consumer>
    {({ config: { hideTotal }, isLoading, currency }) => {
      if (hideTotal) {
        return null;
      }
      return (
        <Fragment>
          <Portal name={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL_BEFORE} />
          <Portal name={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL}>
            <CartTotalLine isDisabled={isLoading} type="grandTotal">
              <CartTotalLine.Label label="cart.total" />
              <CartTotalLine.Amount amount={amount} currency={currency} />
            </CartTotalLine>
          </Portal>
          <Portal name={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL_AFTER} />
        </Fragment>
      );
    }}
  </CartContext.Consumer>
);

GrandTotal.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default connect(GrandTotal);
