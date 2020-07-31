import React from 'react';
import OrderDetails from '../providers/OrderDetailsProvider.context';
import OrderHistory from '../providers/OrderHistoryProvider.context';

/**
 * Returns the value of the order details provider state.
 * @returns {Object}
 */
export const useOrderDetails = () => React.useContext(OrderDetails);

/**
 * Returns the value of the order details provider state.
 * @returns {Object}
 */
export const useOrderHistory = () => React.useContext(OrderHistory);

