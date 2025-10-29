import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  getShippingLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarShippingCost.connector';

/**
 * The PaymentBarShippingCost component.
 * @param {Object} props The component props.
 * @param {Object|null} props.shippingCost The shipping cost details.
 * @param {boolean} [props.showSeparator=true] Whether to show a separator.
 * @param {string|null} [props.className=null] Additional class names.
 * @returns {JSX.Element|null} The rendered component.
 */
const PaymentBarShippingCost = ({ shippingCost, showSeparator, className }) => {
  const {
    currency, isLoading, isUserLoggedIn, config, hasPromotionCoupons,
  } = React.useContext(CartContext);

  const shippingLine = React.useMemo(() => (
    getShippingLine(config, isUserLoggedIn, shippingCost)
  ), [config, isUserLoggedIn, shippingCost]);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SHIPPING}>
      {shippingLine && (
        <CartTotalLine isDisabled={isLoading} type="shipping" className={className}>
          <CartTotalLine.Label
            label={shippingLine.label}
            showSeparator={showSeparator !== null ? showSeparator : !!shippingLine.amount}
          />
          <CartTotalLine.Amount
            amount={shippingLine.amount}
            currency={currency}
          />
          <CartTotalLine.Hint hint={shippingLine.hint} />
          { hasPromotionCoupons && (
            <CartTotalLine.Spacer className={spacer} />
          )}
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
};

PaymentBarShippingCost.propTypes = {
  className: PropTypes.string,
  shippingCost: PropTypes.shape({
    label: PropTypes.string,
    amount: PropTypes.number,
  }),
  showSeparator: PropTypes.bool,
};

PaymentBarShippingCost.defaultProps = {
  className: null,
  showSeparator: true,
  shippingCost: null,
};

export default connect(PaymentBarShippingCost);
