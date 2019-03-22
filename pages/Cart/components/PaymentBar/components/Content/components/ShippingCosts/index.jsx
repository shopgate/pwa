import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartContext from 'Pages/Cart/context';
import portalProps from '../../totalsPortalProps';
import TotalRow from '../TotalRow';
import Label from './components/Label';
import Amount from './components/Amount';

/**
 * @returns {JSX}
 */
const ShippingCosts = () => (
  <CartContext.Consumer>
    {({ shipping: { show } }) => (
      <Fragment>
        <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE} props={portalProps} />
        <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING} props={portalProps}>
          {show !== false && (
            <TotalRow>
              <Label />
              <Amount />
            </TotalRow>
          )}
        </Portal>
        <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER} props={portalProps} />
      </Fragment>
    )}
  </CartContext.Consumer>
);

export default ShippingCosts;
