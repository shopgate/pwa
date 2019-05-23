import React, { Fragment } from 'react';
import { Portal, CartTotalLine } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_BEFORE,
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_AFTER,
} from '@shopgate/engage/cart';
import CartContext from 'Pages/Cart/context';
import connect from './connector';

/**
 * @returns {JSX}
 */
const SubTotal = ({ amount }) => (
  <CartContext.Consumer>
    {({ currency, isLoading }) => (
      <Fragment>
        <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_BEFORE} />
        <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL}>
          {amount &&
            <CartTotalLine isDisabled={isLoading} type="subTotal">
              <CartTotalLine.Label label="cart.subtotal" />
              <CartTotalLine.Amount amount={amount} currency={currency} />
            </CartTotalLine>
          }
        </Portal>
        <Portal name={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL_AFTER} />
      </Fragment>
    )}
  </CartContext.Consumer>
);

SubTotal.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default connect(SubTotal);

