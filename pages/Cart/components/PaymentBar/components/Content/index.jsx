import React, { useContext } from 'react';
import { SurroundPortals, Grid } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_TOTALS,
  FLAG_MULTI_LINE_RESERVE,
} from '@shopgate/engage/cart';
import CartContext from '../../../../context';
import ShippingCosts from './components/ShippingCosts';
import Discounts from './components/Discounts';
import Tax from './components/Tax';
import SubTotal from './components/SubTotal';
import GrandTotal from './components/GrandTotal';
import CheckoutButton from './components/CheckoutButton';
import ReserveButton from './components/ReserveButton';
import styles from './style';

/**
 * The PaymentBarContent component.
 * @returns {JSX}
 */
function PaymentBarContent() {
  const { flags } = useContext(CartContext);

  return (
    <div className={styles.wrapper}>
      <SurroundPortals portalName={CART_PAYMENT_BAR}>
        <Grid className={styles.container}>
          <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS}>
            <SubTotal />
            <Discounts />
            <ShippingCosts />
            <Tax />
            <GrandTotal />
          </SurroundPortals>
        </Grid>
        <div className={styles.checkoutButtonContainer}>
          <div className={styles.checkoutButton}>
            {!flags[FLAG_MULTI_LINE_RESERVE] && <CheckoutButton /> }
            {flags[FLAG_MULTI_LINE_RESERVE] && <ReserveButton /> }
          </div>
        </div>
      </SurroundPortals>
    </div>
  );
}

export default PaymentBarContent;
