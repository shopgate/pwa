import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import connect from './OrderHistoryProvider.connector';
import Context from './OrderHistoryProvider.context';
import { getOrderDetailsRoute } from '../helpers/orderDetails';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const OrderHistoryProvider = ({
  orders,
  fetchOrderHistory,
  children,
  historyPush,
  totalOrderCount,
}) => {
  const value = useMemo(
    () => ({
      orders: orders.map(order => ({
        ...order,
        openDetails: () => historyPush({
          pathname: getOrderDetailsRoute(order.orderNumber),
        }),
      })),
      totalOrderCount,
      fetchOrderHistory,
    }),
    [fetchOrderHistory, historyPush, orders, totalOrderCount]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

OrderHistoryProvider.propTypes = {
  fetchOrderHistory: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
  totalOrderCount: PropTypes.number,
};

OrderHistoryProvider.defaultProps = {
  children: null,
  totalOrderCount: null,
};

export default connect(OrderHistoryProvider);
