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
}) => {
  const { pathname } = useRoute();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = useCallback(async () => {
    setIsLoading(true);
    await fetchOrderHistory();
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

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const value = useMemo(
    () => ({
      orders,
      isLoading,
      openDetails: orderNumber => historyPush({
        pathname: getOrderDetailsRoute(orderNumber),
      }),
    }),
    [historyPush, isLoading, orders]
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
};

OrderHistoryProvider.defaultProps = {
  children: null,
};

export default connect(OrderHistoryProvider);
