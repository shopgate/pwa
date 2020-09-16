import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { i18n } from '@shopgate/engage/core';
import { CrossIcon } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import PaymentBarPromotionCouponMessages from './PaymentBarPromotionCouponMessages';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarPromotionCoupons.connector';

const styles = {
  icon: css({
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
  }).toString(),
  withMessages: css({
    paddingBottom: '0px !important',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const PaymentBarPromotionCoupons = ({
  coupons, className, deleteCoupon, showSeparator,
}) => {
  const { isLoading, currency } = useContext(CartContext);

  return coupons.map((coupon) => {
    const { code, promotion, messages } = coupon;
    const { discount = {} } = promotion || {};
    const { absoluteAmount: amount } = discount;

    return (
      <Fragment key={`promotion-coupon-${code}-${amount}`}>
        <CartTotalLine
          isDisabled={isLoading}
          className={classNames(className, {
            [styles.withMessages]: !!messages.length,
          })}
        >
          <CartTotalLine.Label
            label={i18n.text('cart.coupon_label', { label: code })}
            showSeparator={showSeparator}
          />
          { amount && (
          <CartTotalLine.Amount amount={amount} currency={currency} />
          )}
          <CartTotalLine.Spacer className={spacer}>
            <div
              className={styles.icon}
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
