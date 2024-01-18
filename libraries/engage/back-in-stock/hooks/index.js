import React from 'react';
import BackInStockRemindersProviderContext from '../providers/BackInStockRemindersProvider.context';

/**
 * @returns {Object}
 */
export const useBackInStockReminderContext = () =>
  React.useContext(BackInStockRemindersProviderContext);
