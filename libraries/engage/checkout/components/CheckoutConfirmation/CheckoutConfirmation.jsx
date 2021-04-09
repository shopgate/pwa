import React, { useMemo, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { ResponsiveContainer, RippleButton } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartItems } from '@shopgate/engage/cart';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from '@shopgate/engage/core';
import { i18n } from '../../../core/helpers/i18n';
import { convertLineItemsToCartItems, isReserveOnlyOrder, isDirectShipOnlyOrder } from '../../helpers';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import CheckoutConfirmationPickUpContact from './CheckoutConfirmationPickUpContact';
import CheckoutConfirmationOrderContact from './CheckoutConfirmationOrderContact';
import CheckoutConfirmationPickupNotes from './CheckoutConfirmationPickupNotes';
import CheckoutConfirmationBilledTo from './CheckoutConfirmationBilledTo';
import CheckoutConfirmationShippedTo from './CheckoutConfirmationShippedTo';
import CheckoutConfirmationOrderSummary from './CheckoutConfirmationOrderSummary';
import { SupplementalContent } from '../SupplementalContent';
import connect from './CheckoutConfirmation.connector';

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
    display: 'none',
    [responsiveMediaQuery('>=sm', { webOnly: true })]: {
      display: 'block',
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
  instructions: css({
    marginBottom: variables.gap.xbig,
  }),
  body: css({
    border: 0,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
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
    flex: '0 0 auto !important',
    borderRadius: '2px !important',
    minWidth: '50% !important',
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
const CheckoutConfirmation = ({ onContinueShopping, isUserLoggedIn, fetchCheckoutOrder }) => {
  const { state: { order }, query } = useRoute();
  const [orderData, setOrderData] = useState(null);

  // Finding the source of order data.
  // Either from the route state or from a pipeline request.
  useEffect(() => {
    /** */
    const handleFetch = async () => {
      const data = await fetchCheckoutOrder();
      setOrderData(data);
    };

    if (!order) {
      handleFetch();
      return;
    }

    setOrderData(order);
  }, [fetchCheckoutOrder, order, query]);

  // Map order data to more UI friendly format.
  const {
    orderNumber, date, cartItems, isReserveOnly, isDirectShipOnly, currencyOverride,
  } = useMemo(() => {
    if (!orderData) {
      return {};
    }

    return {
      orderNumber: orderData.orderNumber,
      date: orderData.date,
      cartItems: convertLineItemsToCartItems(orderData.lineItems),
      isReserveOnly: isReserveOnlyOrder(orderData),
      isDirectShipOnly: isDirectShipOnlyOrder(orderData),
      currencyOverride: orderData.currencyCode,
    };
  }, [orderData]);

  if (!orderData || !cartItems) {
    return null;
  }

  return (
    <div className={style.root}>
      <div className={style.main}>
        <div className={style.backButtonContainer}>
          <ResponsiveBackButton label="checkout.success.continue" onClick={onContinueShopping} />
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

          <div className={style.instructions}>
            <p className={style.body}>
              {i18n.text('checkout.success.instructions_1')}
            </p>
            <p className={style.body}>
              {i18n.text('checkout.success.instructions_2')}
            </p>
          </div>

        </div>

        <div className={style.cartItems}>
          <CartItems
            cartItems={cartItems}
            onFocus={() => { }}
            multiLineReservation
            editable={false}
            isCheckoutConfirmation
            isDirectShipOnly={isDirectShipOnly}
            currencyOverride={currencyOverride}
          />
        </div>

        <ResponsiveContainer breakpoint="<md" appAlways>
          <CheckoutConfirmationPickUpContact order={orderData} />
          <CheckoutConfirmationPickupNotes order={orderData} />
          <CheckoutConfirmationShippedTo order={orderData} />
          { (!isUserLoggedIn && isReserveOnly) ? (
            <CheckoutConfirmationOrderContact order={orderData} />
          ) : (
            <CheckoutConfirmationBilledTo order={orderData} />
          ) }
          <CheckoutConfirmationOrderSummary order={orderData} />
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
          <CheckoutConfirmationPickUpContact order={orderData} />
          <CheckoutConfirmationPickupNotes order={orderData} />
          <CheckoutConfirmationShippedTo order={orderData} />
          { (!isUserLoggedIn && isReserveOnly) ? (
            <CheckoutConfirmationOrderContact order={orderData} />
          ) : (
            <CheckoutConfirmationBilledTo order={orderData} />
          ) }
          <CheckoutConfirmationOrderSummary order={orderData} />
          <SupplementalContent className={style.supplementalWrapper} />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CheckoutConfirmation.propTypes = {
  fetchCheckoutOrder: PropTypes.func.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
  onContinueShopping: PropTypes.func.isRequired,
};

export default hot(connect(CheckoutConfirmation));
