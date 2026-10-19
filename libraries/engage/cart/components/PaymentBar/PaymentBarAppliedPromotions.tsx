import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { CartTotalLine } from '@shopgate/engage/components';
import { i18n, isIOSTheme } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { CartContext } from '../../cart.context';
import { getAppliedPromotionsWithoutCoupons } from '../../cart.selectors';
import PaymentBarPromotionalText from './PaymentBarPromotionalText';

export interface PaymentBarAppliedPromotionsProps {
  showSeparator?: boolean;
  className?: string | null;
}

interface AppliedPromotion {
  code: string;
  name: string;
  promotionalText?: string | null;
  discount: { absoluteAmount: number };
}

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * The applied promotions of the cart which do not come from a coupon.
 * @returns The promotion lines.
 */
const PaymentBarAppliedPromotions = ({
  showSeparator = true, className = null,
}: PaymentBarAppliedPromotionsProps) => {
  const { classes } = useStyles();
  const promotions: AppliedPromotion[] = useSelector(getAppliedPromotionsWithoutCoupons);
  const { isLoading, currency, hasPromotionCoupons } = useContext(CartContext);

  return (
    <>
      {promotions.map((promotion) => {
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
      })}
    </>
  );
};

export default PaymentBarAppliedPromotions;
