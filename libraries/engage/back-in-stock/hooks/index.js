import React from 'react';
import { BackInStockSubscriptionsProviderContext } from '@shopgate/engage/back-in-stock';

/**
 * Injects the Back in Stock Subscription Context
 * @returns {JSX}
 */
export const useBackInStockSubscriptionsContext = () =>
  React.useContext(BackInStockSubscriptionsProviderContext);
