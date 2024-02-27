import React from 'react';
import { BackInStockSubscriptionsProvider } from '@shopgate/engage/back-in-stock/providers';
import List from './components/List';

/**
 * The Back in Stock Subscriptions component.
 * @returns {JSX}
 */
const Subscriptions = () => (
  <BackInStockSubscriptionsProvider>
    <List />
  </BackInStockSubscriptionsProvider>
);

export default Subscriptions;
