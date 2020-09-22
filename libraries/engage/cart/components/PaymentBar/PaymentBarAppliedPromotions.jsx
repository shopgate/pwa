import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { i18n } from '@shopgate/engage/core';
import { CartContext } from '../../cart.context';
import PaymentBarPromotionalText from './PaymentBarPromotionalText';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarAppliedPromotions.connector';

/**
 * @returns {JSX}
 */
const PaymentBarAppliedPromotions = ({ promotions, className, showSeparator }) => {
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
          <CartTotalLine.Spacer className={spacer} />
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
