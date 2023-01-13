import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useRoute, LoadingProvider,
} from '@shopgate/engage/core';
import connect from './OrderDetailsPrivateProvider.connector';
import Context from './OrderDetailsProvider.context';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const OrderDetailsProvider = ({
  order,
  orderNumber,
  shopSettings,
  userLocation,
  fetchOrderDetails,
  cancelOrder,
  children,
}) => {
  const { pathname } = useRoute();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = useCallback(async () => {
    setIsLoading(true);
    await fetchOrderDetails(orderNumber);
    setIsLoading(false);
  }, [fetchOrderDetails, orderNumber]);

  const handleCancel = useCallback(async () => {
    setIsLoading(true);
    await cancelOrder(orderNumber);
    setIsLoading(false);
  }, [cancelOrder, orderNumber]);

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
      order,
      isLoading,
      supportedCountries: shopSettings.supportedCountries,
      countrySortOrder: shopSettings.countrySortOrder,
      userLocation,
      fetchOrderDetails,
      cancelOrder: handleCancel,
    }),
    [
      order,
      isLoading,
      shopSettings.supportedCountries,
      shopSettings.countrySortOrder,
      userLocation,
      fetchOrderDetails,
      handleCancel,
    ]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

OrderDetailsProvider.propTypes = {
  cancelOrder: PropTypes.func.isRequired,
  fetchOrderDetails: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
  children: PropTypes.node,
  order: PropTypes.shape(),
  shopSettings: PropTypes.shape(),
  userLocation: PropTypes.shape(),
};

OrderDetailsProvider.defaultProps = {
  children: null,
  shopSettings: null,
  userLocation: null,
  order: null,
};

export default connect(OrderDetailsProvider);
