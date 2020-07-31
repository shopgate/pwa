import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useRoute, LoadingProvider,
} from '@shopgate/engage/core';
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
  const { pathname } = useRoute();
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderHistoryRequest = useCallback(async (params) => {
    setIsLoading(true);
    await fetchOrderHistory(params);
    setIsLoading(false);
  }, [fetchOrderHistory]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      LoadingProvider.setLoading(pathname);
      return;
    }

    LoadingProvider.unsetLoading(pathname);
  }, [isLoading, pathname]);

  const value = useMemo(
    () => ({
      orders: orders.map(order => ({
        ...order,
        openDetails: () => historyPush({
          pathname: getOrderDetailsRoute(order.orderNumber),
        }),
      })),
      totalOrderCount,
      isLoading,
      fetchOrderHistory: handleOrderHistoryRequest,
    }),
    [handleOrderHistoryRequest, historyPush, isLoading, orders, totalOrderCount]
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
