import React from 'react';
import { hot } from 'react-hot-loader/root';
import { i18n } from '@shopgate/engage/core';
import {
  container, headline, summary, grandTotalContainer,
} from './CartSummaryWide.style';
import CartSummaryWideTotalLine from './CartSummaryWideTotalLine';
import CartSummaryWideCheckoutButton from './CartSummaryWideCheckoutButton';
import CartSummaryWideFooter from './CartSummaryWideFooter';
import connector from './CartSummaryWide.connector';

type Props = {
  subTotal?: number,
  grandTotal?: number,
}

/**
 * @param {Object} The component props
 * @returns {JSX}
 */
const CartSummaryWide = ({
  subTotal,
  grandTotal,
}: Props) => (
  <div className={container}>
    <h2 className={headline}>
      {i18n.text('checkout.summary.headline')}
    </h2>
    <div className={summary}>
      <CartSummaryWideTotalLine
        label="cart.subtotal"
        amount={subTotal}
      />
      <CartSummaryWideTotalLine
        label="cart.grand_total"
        amount={grandTotal}
        className={grandTotalContainer}
      />
    </div>
    <CartSummaryWideCheckoutButton />
    <CartSummaryWideFooter />
  </div>

);

CartSummaryWide.defaultProps = {
  subTotal: null,
  grandTotal: null,
};

export default hot(connector(CartSummaryWide));
