import React from 'react';
import { hot } from 'react-hot-loader/root';
import OrderHistory from '../../../orders/components/OrderHistory';
import OrderHistoryProvider from '../../../orders/providers/OrderHistoryProvider';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const Account = () => (
  <OrderHistoryProvider>
    <OrderHistory />
  </OrderHistoryProvider>
);

export default hot(Account);
