import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { ResponsiveContainer, RippleButton } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartItems } from '@shopgate/engage/cart';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';
import { convertLineItemsToCartItems } from '../../helpers';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import CheckoutConfirmationPickUpContact from './CheckoutConfirmationPickUpContact';
import CheckoutConfirmationPickupNotes from './CheckoutConfirmationPickupNotes';
import CheckoutConfirmationBilledTo from './CheckoutConfirmationBilledTo';
import CheckoutConfirmationOrderSummary from './CheckoutConfirmationOrderSummary';
import { SupplementalContent } from '../SupplementalContent';

const { variables } = themeConfig;

const style = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
  }),
  main: css({
    flex: 1,
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      paddingRight: 16,
    },
  }),
  side: css({
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      marginTop: 134,
      marginLeft: variables.gap.big * -1,
      flex: 0.45,
    },
  }),
  cartItems: css({
    marginBottom: 32,
  }),
  container: css({
    padding: `${variables.gap.big}px ${variables.gap.small * 1.5}px 0 ${variables.gap.xbig}px`,
    [responsiveMediaQuery('<sm')]: {
      paddingLeft: variables.gap.big,
    },
  }),
  backButtonContainer: css({
    paddingLeft: variables.gap.big,
    [responsiveMediaQuery('<sm')]: {
      display: 'none',
    },
  }),
  heading: css({
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
    paddingBottom: variables.gap.xbig,
  }),
  yourItemsHeading: css({
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: `${variables.gap.bigger}px 0 0`,
  }),
  body: css({
    padding: `${variables.gap.big}px 0 0`,
    margin: `0 0 ${variables.gap.bigger}px`,
    border: 0,
  }),
  orderNum: css({
    padding: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: '1.5rem',
    margin: `0 0 ${variables.gap.big}px`,
    border: 0,
  }),
  button: css({
    flex: '0 0 auto',
    borderRadius: 2,
    minWidth: '50%',
    [responsiveMediaQuery('<md')]: {
      width: '100%',
    },
  }),
  buttonWrapper: css({
    padding: variables.gap.big,
  }),
  supplementalWrapper: css({
    padding: `${variables.gap.xbig}px ${variables.gap.big}px`,
  }).toString(),
};

/**
 * CheckoutConfirmation component
 * @returns {JSX}
 */
const CheckoutConfirmation = ({ onContinueShopping }) => {
  const { state: { order } } = useRoute();

  const { orderNumber, date, cartItems } = useMemo(() => {
    if (!order) {
      return {};
    }

    return {
      orderNumber: order.orderNumber,
      date: order.date,
      cartItems: convertLineItemsToCartItems(order.lineItems),
    };
  }, [order]);

  if (!order || !cartItems) {
    return null;
  }

  return (
    <div className={style.root}>
      <div className={style.main}>
        <div className={style.backButtonContainer}>
          <ResponsiveBackButton label="checkout.success.continue" />
        </div>
        <div className={style.container}>
          <h2 className={style.heading}>
            {i18n.text('checkout.success.title')}
          </h2>
          <p className={style.orderNum}>
            {i18n.text('checkout.success.order_date', { date: i18n.date(new Date(date).getTime(), 'short') })}
            {' | '}
            {i18n.text('checkout.success.order_number', { orderNumber })}
          </p>
          <p className={style.body}>
            {i18n.text('checkout.success.copy')}
          </p>

        </div>

        <div className={style.cartItems}>
          <CartItems
            cartItems={cartItems}
            onFocus={() => { }}
            multiLineReservation
            editable={false}
          />
        </div>

        <ResponsiveContainer breakpoint="<md" appAlways>
          <CheckoutConfirmationPickUpContact order={order} />
          <CheckoutConfirmationPickupNotes order={order} />
          <CheckoutConfirmationBilledTo order={order} />
          <CheckoutConfirmationOrderSummary order={order} />
          <SupplementalContent className={style.supplementalWrapper} />
        </ResponsiveContainer>
        <div className={style.buttonWrapper}>
          <RippleButton
            type="secondary"
            disabled={false}
            className={style.button.toString()}
            onClick={onContinueShopping}
          >
            {i18n.text('checkout.success.continue')}
          </RippleButton>
        </div>

      </div>
      <div className={style.side}>
        <ResponsiveContainer breakpoint=">=md" webOnly>
          <CheckoutConfirmationPickUpContact order={order} />
          <CheckoutConfirmationPickupNotes order={order} />
          <CheckoutConfirmationBilledTo order={order} />
          <CheckoutConfirmationOrderSummary order={order} />
          <SupplementalContent className={style.supplementalWrapper} />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CheckoutConfirmation.propTypes = {
  onContinueShopping: PropTypes.func.isRequired,
};

export default hot(CheckoutConfirmation);
