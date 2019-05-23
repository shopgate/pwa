import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, CartTotalLine } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS,
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS_BEFORE,
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS_AFTER,
} from '@shopgate/engage/cart';
import CartContext from 'Pages/Cart/context';
import connect from './connector';

/**
 * The Discounts component.
 * @returns {JSX}
 */
const Discounts = ({ discounts }) => {
  if (!discounts) {
    return null;
  }

  return (
    <CartContext.Consumer>
      {({ currency, isLoading }) => (
        <Fragment>
          <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS_BEFORE} />
          <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS}>
            {discounts.map(({ label, amount }) => (
              <CartTotalLine key={`discount-${label}-${amount}`} type="discount" isDisabled={isLoading}>
                <CartTotalLine.Label
                  label={label ? 'cart.discount_with_label' : 'cart.discount'}
                  labelParams={{ label }}
                />
                <CartTotalLine.Amount amount={-amount} currency={currency} />
              </CartTotalLine>
            ))}
          </Portal>
          <Portal name={CART_PAYMENT_BAR_TOTALS_DISCOUNTS_AFTER} />
        </Fragment>
      )}
    </CartContext.Consumer>
  );
};

Discounts.propTypes = {
  discounts: PropTypes.arrayOf(PropTypes.shape()),
};

Discounts.defaultProps = {
  discounts: null,
};

export default connect(Discounts);
