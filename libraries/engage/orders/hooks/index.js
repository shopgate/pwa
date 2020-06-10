import React from 'react';
import OrderDetails from '../providers/OrderDetailsProvider.context';

/**
 * Returns the value of the order details provider state.
 * @returns {Object}
 */
export const useOrderDetails = () => React.useContext(OrderDetails);

