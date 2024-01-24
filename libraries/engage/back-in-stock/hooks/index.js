import React from 'react';
import BackInStockSubscriptionsProvider from '../providers/BackInStockSubscriptionsProvider.context';

/**
 * Injects the Back in Stock Subscription Context
 * @returns {JSX}
 */
export const useBackInStockSubscriptionsContext = () =>
  React.useContext(BackInStockSubscriptionsProvider);
