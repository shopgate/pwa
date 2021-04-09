import React, { useMemo } from 'react';
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
import {
  root,
  contactsWrapper,
  contact,
  cartWrapper,
  summaryWrapper,
  summary,
  supplemental,
} from './OrderDetailsOrder.style';

/**
 * The OrderDetailsOrder component
 * @returns {JSX}
 */
const OrderDetailsOrder = () => {
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
    <div className={root}>
      <OrderDetailsOrderHeader order={order} />
      <div className={contactsWrapper}>
        { (!isUserLoggedIn && isReserveOnly) ? (
          <CheckoutConfirmationOrderContact order={order} className={contact} />
        ) : (
          <CheckoutConfirmationBilledTo order={order} className={contact} />
        ) }
        <CheckoutConfirmationShippedTo order={order} className={contact} />
        <CheckoutConfirmationPickUpContact order={order} className={contact} />
        <OrderDetailsOrderPickupLocation order={order} className={contact} />
      </div>
      <div className={cartWrapper}>
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
      <div className={summaryWrapper}>
        <CheckoutConfirmationOrderSummary order={order} className={summary} />
        <SupplementalContent className={supplemental} />
      </div>
    </div>
  );
};

export default OrderDetailsOrder;
