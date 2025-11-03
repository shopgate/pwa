import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarSubTotal.connector';

/**
 * Renders the PaymentBarSubTotal component.
 * @param {Object} props The component props.
 * @param {number} props.amount The subtotal amount.
 * @param {string} [props.label] The label for the subtotal.
 * @param {boolean} [props.showSeparator=true] Whether to show a separator.
 * @param {string|null} [props.className=null] The class name for styling.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const PaymentBarSubTotal = ({
  amount, label, showSeparator, className,
}) => {
  const { currency, isLoading, hasPromotionCoupons } = React.useContext(CartContext);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL}>
      {amount && (
        <CartTotalLine isDisabled={isLoading} type="subTotal" className={className}>
          <CartTotalLine.Label label={label} showSeparator={showSeparator} />
          <CartTotalLine.Amount amount={amount} currency={currency} />
          {hasPromotionCoupons && (
            <CartTotalLine.Spacer className={spacer} />
          )}
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
};

PaymentBarSubTotal.propTypes = {
  amount: PropTypes.number.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  showSeparator: PropTypes.bool,
};

PaymentBarSubTotal.defaultProps = {
  className: null,
  showSeparator: true,
  label: 'cart.subtotal',
};

export default connect(PaymentBarSubTotal);
