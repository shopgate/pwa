import { useContext, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { i18n, isIOSTheme } from '@shopgate/engage/core';
import { CrossIcon, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { getPromotionCoupons, deleteCouponsFromCart } from '@shopgate/engage/cart';
import PaymentBarPromotionCouponMessages from './PaymentBarPromotionCouponMessages';
import type { CouponMessage } from './PaymentBarPromotionCouponMessages';
import { CartContext } from '../../cart.context';
import PaymentBarPromotionalText from './PaymentBarPromotionalText';

export interface PaymentBarPromotionCouponsProps {
  showSeparator?: boolean;
  className?: string | null;
}

interface PromotionCoupon {
  code: string;
  messages: CouponMessage[];
  promotion?: {
    promotionalText?: string | null;
    discount?: { absoluteAmount?: number };
  } | null;
}

const useStyles = makeStyles()(theme => ({
  icon: {
    backgroundColor: theme.palette.grey.dark,
    color: theme.contrastColor(theme.palette.grey.dark),
    borderRadius: 32,
    padding: 4,
    cursor: 'pointer',
    fontSize: theme.components.icon.xsmall,
    display: 'inline-flex',
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      padding: 3,
    },
  },
  withMessages: {
    paddingBottom: '0px !important',
  },
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
}));

/**
 * The coupons of the cart with their promotions, messages and a button to remove them.
 * @returns The coupon lines.
 */
const PaymentBarPromotionCoupons = ({
  showSeparator = true, className = null,
}: PaymentBarPromotionCouponsProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => unknown;
  const coupons: PromotionCoupon[] = useSelector(getPromotionCoupons);
  const { isLoading, currency } = useContext(CartContext);

  return (
    <>
      {coupons.map((coupon) => {
        const { code, promotion, messages } = coupon;
        const { discount = {}, promotionalText } = promotion || {};
        const { absoluteAmount: amount } = discount;

        let hasError = false;

        if (Array.isArray(messages) && messages.length) {
          hasError = !!messages.find(({ type }) => type === 'error');
        }

        return (
          <Fragment key={`promotion-coupon-${code}-${amount}`}>
            <CartTotalLine
              isDisabled={isLoading}
              className={cx(className, {
                [classes.withMessages]: !!messages.length,
              })}
            >
              <CartTotalLine.Label
                label={i18n.text('cart.coupon_label', { label: code })}
                showSeparator={showSeparator}
                suffix={!hasError ? (<PaymentBarPromotionalText text={promotionalText} />) : null}
              />
              { amount && (
              <CartTotalLine.Amount amount={amount} currency={currency} />
              )}
              <CartTotalLine.Spacer className={classes.spacer}>
                <div
                  className={classes.icon}
                  onClick={() => { dispatch(deleteCouponsFromCart([code])); }}
                  onKeyDown={() => { dispatch(deleteCouponsFromCart([code])); }}
                  role="button"
                  tabIndex={0}
                >
                  <CrossIcon />
                </div>
              </CartTotalLine.Spacer>
            </CartTotalLine>
            <PaymentBarPromotionCouponMessages messages={messages} />
            { hasError && (
              <PaymentBarPromotionalText text={promotionalText} renderIcon={false} />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default PaymentBarPromotionCoupons;
