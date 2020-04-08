import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { CartItems } from '@shopgate/engage/cart';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RippleButton } from '@shopgate/engage/components';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationPickUpContact from './CheckoutConfirmationPickUpContact';
import CheckoutConfirmationPickupNotes from './CheckoutConfirmationPickupNotes';
import CheckoutConfirmationBilledTo from './CheckoutConfirmationBilledTo';
import CheckoutConfirmationOrderSummary from './CheckoutConfirmationOrderSummary';
import connect from './CheckoutConfirmation.connector';

const { variables } = themeConfig;

const style = {
  container: css({
    padding: `${variables.gap.big}px ${variables.gap.small * 1.5}px 0 ${variables.gap.small * 1.5}px`,
  }),
  heading: css({
    fontSize: '1.125rem',
    fontWeight: 'bold',
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
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: `0 0 ${variables.gap.big}px`,
    border: 0,
  }),
  button: css({
    margin: `${variables.gap.big}px ${variables.gap.small * 1.5}px ${variables.gap.xbig}px ${variables.gap.small * 1.5}px`,
    borderRadius: 2,
  }),
};

/**
 * CheckoutConfirmation component
 * @returns {JSX}
 */
const CheckoutConfirmation = ({ order, cartItems }) => {
  if (!order) {
    return null;
  }

  const { orderNumber, date } = order;

  return (
    <Fragment>
      <div className={style.container}>
        <h2 className={style.heading}>
          {i18n.text('checkout.success.title')}
        </h2>
        <p className={style.body}>
          {i18n.text('checkout.success.copy')}
        </p>
        <p className={style.orderNum}>
          {i18n.text('checkout.success.order_date', { date: i18n.date(new Date(date).getTime(), 'short') })}
          <br />
          {i18n.text('checkout.success.order_number', { orderNumber })}
        </p>
        <h3 className={style.yourItemsHeading}>{i18n.text('checkout.success.your_items')}</h3>
      </div>

      <CartItems
        cartItems={cartItems}
        onFocus={() => { }}
        multiLineReservation
        editable={false}
      />

      <CheckoutConfirmationPickUpContact order={order} />
      <CheckoutConfirmationPickupNotes order={order} />
      <CheckoutConfirmationBilledTo order={order} />
      <CheckoutConfirmationOrderSummary order={order} />

      <RippleButton
        type="secondary"
        disabled={false}
        className={style.button}
      >
        {i18n.text('checkout.success.continue')}
      </RippleButton>

    </Fragment>
  );
};

CheckoutConfirmation.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  order: PropTypes.shape().isRequired,
};

export default connect(CheckoutConfirmation);
