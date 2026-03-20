import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { i18n, isIOSTheme } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';
import PaymentBarPromotionalText from './PaymentBarPromotionalText';
import connect from './PaymentBarAppliedPromotions.connector';

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * @returns {JSX}
 */
const PaymentBarAppliedPromotions = ({ promotions, className, showSeparator }) => {
  const { classes } = useStyles();
  const { isLoading, currency, hasPromotionCoupons } = useContext(CartContext);

  return promotions.map((promotion) => {
    const {
      discount, code, name, promotionalText,
    } = promotion;
    const { absoluteAmount: amount } = discount;

    return (
      <CartTotalLine
        key={`promotion-${code}-${amount}`}
        isDisabled={isLoading}
        className={className}
      >
        <CartTotalLine.Label
          label={i18n.text('cart.promotion_label', { label: name })}
          showSeparator={showSeparator}
          suffix={(<PaymentBarPromotionalText text={promotionalText} />)}
        />
        <CartTotalLine.Amount amount={amount} currency={currency} />
        { hasPromotionCoupons && (
          <CartTotalLine.Spacer className={classes.spacer} />
        )}
      </CartTotalLine>
    );
  });
};

PaymentBarAppliedPromotions.propTypes = {
  promotions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  className: PropTypes.string,
  showSeparator: PropTypes.bool,
};

PaymentBarAppliedPromotions.defaultProps = {
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarAppliedPromotions);
