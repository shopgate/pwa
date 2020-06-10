import React from 'react';
import { hot } from 'react-hot-loader/root';
import { useRoute } from '@shopgate/engage/core';
import OrderDetailsContent from './OrderDetailsContent';
import OrderDetailsProvider from '../../providers/OrderDetailsProvider';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderDetails = () => {
  const { params: { orderId } } = useRoute();

  return (
    <OrderDetailsProvider orderId={orderId}>
      <OrderDetailsContent />
    </OrderDetailsProvider>
  );
};

export default hot(OrderDetails);
