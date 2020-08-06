import React from 'react';
import { hot } from 'react-hot-loader/root';
import { useRoute } from '@shopgate/engage/core';
import OrderDetailsContent from './OrderDetailsContent';
import OrderDetailsProvider from '../../providers/OrderDetailsProvider';
import OrderDetailsOrder from './OrderDetailsOrder';
import OrderDetailsPrivateProvider from '../../providers/OrderDetailsPrivateProvider';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderDetails = () => {
  const { params: { orderId, orderNumber } } = useRoute();
  if (orderNumber) {
    return (
      <OrderDetailsPrivateProvider orderNumber={orderNumber}>
        <OrderDetailsOrder />
      </OrderDetailsPrivateProvider>
    );
  }
  return (
    <OrderDetailsProvider orderId={orderId}>
      <OrderDetailsContent />
    </OrderDetailsProvider>
  );
};

export default hot(OrderDetails);
