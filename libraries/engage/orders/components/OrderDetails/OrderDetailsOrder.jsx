import React, { useMemo } from 'react';
import { CartItems } from '@shopgate/engage/cart';
import {
  CheckoutConfirmationPickUpContact,
  CheckoutConfirmationOrderContact,
  CheckoutConfirmationBilledTo,
  CheckoutConfirmationOrderSummary,
  SupplementalContent,
} from '../../../checkout/components';
import { convertLineItemsToCartItems, isReserveOnlyOrder } from '../../../checkout/helpers';
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
    cartItems, isReserveOnly,
  } = useMemo(() => {
    if (!order) {
      return {};
    }

    return {
      orderNumber: order.orderNumber,
      date: order.date,
      cartItems: convertLineItemsToCartItems(order.lineItems),
      isReserveOnly: isReserveOnlyOrder(order),
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
