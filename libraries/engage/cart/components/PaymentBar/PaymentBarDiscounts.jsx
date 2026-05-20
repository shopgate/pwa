import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import { CART_PAYMENT_BAR_TOTALS_DISCOUNTS } from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarDiscounts.connector';

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * The Discounts component.
 * @param {Object} props The component props.
 * @param {Array} [props.discounts=null] An array of discount objects.
 * @param {boolean} [props.showSeparator=true] Whether to show a separator.
 * @param {string|null} [props.className=null] The class name for styling.
 * @returns {JSX.Element|null} The rendered component or null.
 */
function PaymentBarDiscounts({ discounts, showSeparator, className }) {
  const { classes } = useStyles();
  const { currency, isLoading, hasPromotionCoupons } = React.useContext(CartContext);

  if (!discounts) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_DISCOUNTS}>
      {discounts.map(({ label, amount }) => (
        <CartTotalLine
          key={`discount-${label}-${amount}`}
          type="discount"
          isDisabled={isLoading}
          className={className}
        >
          <CartTotalLine.Label
            label={label ? 'cart.discount_with_label' : 'cart.discount'}
            labelParams={{ label }}
            showSeparator={showSeparator}
          />
          <CartTotalLine.Amount amount={-amount} currency={currency} />
          {hasPromotionCoupons && (
            <CartTotalLine.Spacer className={classes.spacer} />
          )}
        </CartTotalLine>
      ))}
    </SurroundPortals>
  );
}

PaymentBarDiscounts.propTypes = {
  className: PropTypes.string,
  discounts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
  showSeparator: PropTypes.bool,
};

PaymentBarDiscounts.defaultProps = {
  discounts: null,
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarDiscounts);
