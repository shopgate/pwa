import React from 'react';
import BackInStockRemindersProvider from '../../providers/BackInStockRemindersProvider';
import List from '../List';

/**
 * The BackInStockReminders component.
 * @returns {JSX}
 */
const BackInStockReminders = () =>
  (
    <BackInStockRemindersProvider>
      <List />
    </BackInStockRemindersProvider>
  );

export default BackInStockReminders;
