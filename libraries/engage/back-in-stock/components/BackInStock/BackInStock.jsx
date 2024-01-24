import React from 'react';
import BackInStockSubscriptionsProvider from '../../providers/BackInStockSubscriptionsProvider';
import List from '../List';

/**
 * The Back in Stock component.
 * @returns {JSX}
 */
const BackInStock = () => (
  <BackInStockSubscriptionsProvider>
    <List />
  </BackInStockSubscriptionsProvider>
);

export default BackInStock;
