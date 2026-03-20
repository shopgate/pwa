import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { i18n, isIOSTheme } from '@shopgate/engage/core';
import { CrossIcon } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import PaymentBarPromotionCouponMessages from './PaymentBarPromotionCouponMessages';
import { CartContext } from '../../cart.context';
import PaymentBarPromotionalText from './PaymentBarPromotionalText';
import connect from './PaymentBarPromotionCoupons.connector';

const useStyles = makeStyles()({
  icon: {
    backgroundColor: '#898989',
    color: '#fff',
    borderRadius: 32,
    padding: 4,
    cursor: 'pointer',
    fontSize: '0.75rem',
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
});

/**
 * @returns {JSX}
 */
const PaymentBarPromotionCoupons = ({
  coupons, className, deleteCoupon, showSeparator,
}) => {
  const { classes } = useStyles();
  const { isLoading, currency } = useContext(CartContext);

  return coupons.map((coupon) => {
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
          className={classNames(className, {
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
              onClick={() => { deleteCoupon(code); }}
              onKeyDown={() => { deleteCoupon(code); }}
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
  });
};

PaymentBarPromotionCoupons.propTypes = {
  coupons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  deleteCoupon: PropTypes.func.isRequired,
  className: PropTypes.string,
  showSeparator: PropTypes.bool,
};

PaymentBarPromotionCoupons.defaultProps = {
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarPromotionCoupons);
