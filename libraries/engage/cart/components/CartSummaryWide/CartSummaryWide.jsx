import React from 'react';
import { hot } from 'react-hot-loader/root';
import { i18n } from '@shopgate/engage/core';
import {
  container, headline, summary, total, grandTotal,
} from './CartSummaryWide.style';
import PaymentBarSubTotal from '../PaymentBar/PaymentBarSubTotal';
import PaymentBarGrandTotal from '../PaymentBar/PaymentBarGrandTotal';
import PaymentBarShippingCost from '../PaymentBar/PaymentBarShippingCost';
import PaymentBarDiscounts from '../PaymentBar/PaymentBarDiscounts';
import PaymentBarTax from '../PaymentBar/PaymentBarTax';
import CartSummaryWideCheckoutButton from './CartSummaryWideCheckoutButton';
import CartSummaryWideFooter from './CartSummaryWideFooter';

/**
 * @param {Object} The component props
 * @returns {JSX}
 */
const CartSummaryWide = () => (
  <div className={container}>
    <h2 className={headline}>
      {i18n.text('checkout.summary.headline')}
    </h2>
    <div className={summary}>
      <PaymentBarSubTotal showSeparator={false} label="cart.subtotal" className={total} />
      <PaymentBarDiscounts showSeparator={false} className={total} />
      <PaymentBarShippingCost showSeparator={false} className={total} />
      <PaymentBarTax showSeparator={false} className={total} />
      <PaymentBarGrandTotal
        showSeparator={false}
        label="cart.grand_total"
        className={grandTotal}
      />
    </div>
    <CartSummaryWideCheckoutButton />
    <CartSummaryWideFooter />
  </div>
);

export default hot(CartSummaryWide);
