import React from 'react';
import BackInStockSubscriptionsProvider from '../providers/BackInStockSubscriptionsProvider.context';

/**
 * @returns {Object}
 */
export const useBackInStockSubscriptionsContext = () =>
  React.useContext(BackInStockSubscriptionsProvider);
