import React from 'react';
import { BackInStockSubscriptionsProviderContext } from '@shopgate/engage/back-in-stock';

/**
 * Gives access to the values which the context BackInStockSubscriptionsProvider provide
 * @returns {JSX}
 */
export const useBackInStockSubscriptions = () =>
  React.useContext(BackInStockSubscriptionsProviderContext);
