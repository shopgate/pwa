import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarGrandTotal.connector';

/**
 * The GrandTotal component.
 * @param {Object} props The component props.
 * @param {number} props.amount The grand total amount.
 * @param {string} [props.label] The label for the grand total.
 * @param {boolean} [props.showSeparator=true] Whether to show a separator.
 * @param {string|null} [props.className=null] The class name for styling.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const PaymentBarGrandTotal = ({
  amount, label, showSeparator, className,
}) => {
  const {
    config: { hideTotal }, isLoading, currency, hasPromotionCoupons,
  } = React.useContext(CartContext);

  if (hideTotal) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL}>
      <CartTotalLine isDisabled={isLoading} type="grandTotal" className={className}>
        <CartTotalLine.Label label={label} showSeparator={showSeparator} />
        <CartTotalLine.Amount amount={amount} currency={currency} />
        {hasPromotionCoupons && (
          <CartTotalLine.Spacer className={spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
};

PaymentBarGrandTotal.propTypes = {
  amount: PropTypes.number.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  showSeparator: PropTypes.bool,
};

PaymentBarGrandTotal.defaultProps = {
  className: null,
  showSeparator: true,
  label: 'cart.total',
};

export default connect(PaymentBarGrandTotal);
