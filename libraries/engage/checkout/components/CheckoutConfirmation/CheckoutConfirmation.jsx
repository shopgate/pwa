import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, RippleButton } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartItems } from '@shopgate/engage/cart';
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

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      paddingRight: 16,
    },
  },
  side: {
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      marginTop: 134,
      marginLeft: theme.spacing(-2),
      flex: 0.45,
    },
  },
  cartItems: {
    marginBottom: 32,
  },
  container: {
    padding: theme.spacing(2, 1.5, 0, 4),
    [responsiveMediaQuery('<sm')]: {
      paddingLeft: theme.spacing(2),
    },
  },
  backButtonContainer: {
    paddingLeft: theme.spacing(2),
    display: 'none',
    [responsiveMediaQuery('>=sm', { webOnly: true })]: {
      display: 'block',
    },
  },
  heading: {
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
    paddingBottom: theme.spacing(4),
  },
  instructions: {
    marginBottom: theme.spacing(4),
  },
  body: {
    border: 0,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  orderNum: {
    padding: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: '1.5rem',
    margin: theme.spacing(0, 0, 2),
    border: 0,
  },
  button: {
    flex: '0 0 auto !important',
    borderRadius: '2px !important',
    minWidth: '50% !important',
    [responsiveMediaQuery('<md')]: {
      width: '100%',
    },
  },
  buttonWrapper: {
    padding: theme.spacing(2),
  },
  supplementalWrapper: {
    padding: theme.spacing(4, 2),
  },
}));

/**
 * CheckoutConfirmation component
 * @returns {JSX}
 */
const CheckoutConfirmation = ({ onContinueShopping, isUserLoggedIn, fetchCheckoutOrder }) => {
  const { classes } = useStyles();
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
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.backButtonContainer}>
          <ResponsiveBackButton label="checkout.success.continue" onClick={onContinueShopping} />
        </div>
        <div className={classes.container}>
          <h2 className={classes.heading}>
            {i18n.text('checkout.success.title')}
          </h2>
          <p className={classes.orderNum}>
            {i18n.text('checkout.success.order_date', { date: i18n.date(new Date(date).getTime(), 'short') })}
            {' | '}
            {i18n.text('checkout.success.order_number', { orderNumber })}
          </p>

          <div className={classes.instructions}>
            <p className={classes.body}>
              {i18n.text('checkout.success.instructions_1')}
            </p>
            <p className={classes.body}>
              {i18n.text('checkout.success.instructions_2')}
            </p>
          </div>

        </div>

        <div className={classes.cartItems}>
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
          <SupplementalContent className={classes.supplementalWrapper} />
        </ResponsiveContainer>
        <div className={classes.buttonWrapper}>
          <RippleButton
            type="secondary"
            disabled={false}
            className={classes.button}
            onClick={onContinueShopping}
          >
            {i18n.text('checkout.success.continue')}
          </RippleButton>
        </div>

      </div>
      <div className={classes.side}>
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
          <SupplementalContent className={classes.supplementalWrapper} />
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

export default connect(CheckoutConfirmation);
