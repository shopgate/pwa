import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import OrderHistory from '../../../orders/components/OrderHistory';
import OrderHistoryProvider from '../../../orders/providers/OrderHistoryProvider';
import Tabs, { Tab, TabPanel } from '../../../components/Tabs';
import { tabs, title } from './Account.style';
import { ResponsiveContainer } from '../../../components';

/**
 * The Tabs components
 * @returns {JSX}
 */
const Account = () => {
  const [value, setValue] = useState(0);
  return (
    <>
      <div className={tabs}>
        <ResponsiveContainer webOnly breakpoint=">xs">
          <div className={title}>
            <I18n.Text string="titles.your_account" />
          </div>
        </ResponsiveContainer>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="disabled tabs example"
        >
          <Tab label="Profile" />
          <Tab label="Order History" />
          <Tab label="Wish List" />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
      Profile
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OrderHistoryProvider>
          <OrderHistory />
        </OrderHistoryProvider>
      </TabPanel>
      <TabPanel value={value} index={2}>
      Wish List
      </TabPanel>
    </>
  );
};

export default hot(Account);
