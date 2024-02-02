import React from 'react';
import BackInStockSubscriptionsProvider from '@shopgate/engage/back-in-stock/providers/BackInStockSubscriptionsProvider.context';

/**
 * Injects the Back in Stock Subscription Context
 * @returns {JSX}
 */
export const useBackInStockSubscriptionsContext = () =>
  React.useContext(BackInStockSubscriptionsProvider);
