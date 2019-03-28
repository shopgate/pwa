import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE,
  CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER,
  getShippingLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartContext from 'Pages/Cart/context';
import portalProps from '../../totalsPortalProps';
import TotalRow from '../TotalRow';
import connect from './connector';

/**
 * @returns {JSX}
 */
const ShippingCosts = ({ shippingCost }) => (
  <CartContext.Consumer>
    {({ isUserLoggedIn, config }) => {
      const shippingLine = getShippingLine(config, isUserLoggedIn, shippingCost);

      return (
        <Fragment>
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_BEFORE} props={portalProps} />
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING} props={portalProps}>
            {shippingLine && (
              <TotalRow>
                <TotalRow.Label label={shippingLine.label} hasAmount={!!shippingLine.amount} />
                <TotalRow.Amount />
              </TotalRow>
            )}
          </Portal>
          <Portal name={CART_PAYMENT_BAR_TOTALS_SHIPPING_AFTER} props={portalProps} />
        </Fragment>
      );
    }}
  </CartContext.Consumer>
);

ShippingCosts.propTypes = {
  shippingCost: PropTypes.number.isRequired,
};

export default connect(ShippingCosts);
