import React, { useMemo } from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CartItems } from '@shopgate/engage/cart';
import {
  CheckoutConfirmationPickUpContact,
  CheckoutConfirmationOrderContact,
  CheckoutConfirmationBilledTo,
  CheckoutConfirmationShippedTo,
  CheckoutConfirmationOrderSummary,
  SupplementalContent,
} from '../../../checkout/components';
import { convertLineItemsToCartItems, isDirectShipOnlyOrder, isReserveOnlyOrder } from '../../../checkout/helpers';
import { useOrderDetails } from '../../hooks';
import OrderDetailsOrderHeader from './OrderDetailsOrderHeader';
import OrderDetailsOrderPickupLocation from './OrderDetailsOrderPickupLocation';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2, 0),
  },
  contactsWrapper: {
    paddingBottom: theme.spacing(2),
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      display: 'flex',
    },
  },
  contact: {
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      ':first-child': {
        paddingLeft: theme.spacing(2),
      },
      ':last-child': {
        paddingRight: theme.spacing(2),
      },
    },
  },
  cartWrapper: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  summaryWrapper: {
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
  },
  summary: {
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
  supplemental: {
    padding: theme.spacing(2),
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
}));

/**
 * The OrderDetailsOrder component
 * @returns {JSX}
 */
const OrderDetailsOrder = () => {
  const { classes } = useStyles();
  const {
    isUserLoggedIn,
    order,
  } = useOrderDetails();

  const {
    cartItems, isReserveOnly, isDirectShipOnly, currencyOverride,
  } = useMemo(() => {
    if (!order?.lineItems) {
      return {};
    }

    return {
      orderNumber: order.orderNumber,
      date: order.date,
      cartItems: convertLineItemsToCartItems(order.lineItems),
      isReserveOnly: isReserveOnlyOrder(order),
      isDirectShipOnly: isDirectShipOnlyOrder(order),
      currencyOverride: order.currencyCode,
    };
  }, [order]);
  if (!order || !cartItems) {
    return null;
  }

  return (
    <div className={classes.root}>
      <OrderDetailsOrderHeader order={order} />
      <div className={classes.contactsWrapper}>
        { (!isUserLoggedIn && isReserveOnly) ? (
          <CheckoutConfirmationOrderContact order={order} className={classes.contact} />
        ) : (
          <CheckoutConfirmationBilledTo order={order} className={classes.contact} />
        ) }
        <CheckoutConfirmationShippedTo order={order} className={classes.contact} />
        <CheckoutConfirmationPickUpContact order={order} className={classes.contact} />
        <OrderDetailsOrderPickupLocation order={order} className={classes.contact} />
      </div>
      <div className={classes.cartWrapper}>
        <CartItems
          cartItems={cartItems}
          onFocus={() => { }}
          editable={false}
          multiLineReservation
          isOrderDetails
          isDirectShipOnly={isDirectShipOnly}
          currencyOverride={currencyOverride}
        />
      </div>
      <div className={classes.summaryWrapper}>
        <CheckoutConfirmationOrderSummary order={order} className={classes.summary} />
        <SupplementalContent className={classes.supplemental} />
      </div>
    </div>
  );
};

export default OrderDetailsOrder;
