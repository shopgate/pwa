import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_TAX,
  getTaxLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarTax.connector';

/**
 * The Tax component.
 * @param {Object} props The component props.
 * @param {Object} [props.taxData] The tax data.
 * @param {boolean} [props.showSeparator=true] Whether to show a separator.
 * @param {string|null} [props.className=null] The class name for styling.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const PaymentBarTax = ({ taxData, showSeparator, className }) => {
  const {
    currency, isLoading, config, hasPromotionCoupons,
  } = React.useContext(CartContext);

  if (!taxData) {
    return null;
  }

  const taxLine = getTaxLine(config, taxData);

  if (!taxLine) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_TAX}>
      <CartTotalLine isDisabled={isLoading} type="tax" className={className}>
        <CartTotalLine.Label label={taxLine.label} showSeparator={showSeparator} />
        <CartTotalLine.Amount amount={taxLine.amount} currency={currency} />
        <CartTotalLine.Hint hint={taxLine.hint} />
        { hasPromotionCoupons && (
          <CartTotalLine.Spacer className={spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
};

PaymentBarTax.propTypes = {
  className: PropTypes.string,
  showSeparator: PropTypes.bool,
  taxData: PropTypes.shape({
    label: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }),
};

PaymentBarTax.defaultProps = {
  taxData: null,
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarTax);
