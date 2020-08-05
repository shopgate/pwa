import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import appConfig from '@shopgate/pwa-common/helpers/config';
import OrderHistory from '../../../orders/components/OrderHistory';
import OrderHistoryProvider from '../../../orders/providers/OrderHistoryProvider';
import { Tabs, Tab, TabPanel } from '../../../components/Tabs';
import { tabs, title } from './Account.style';
import { ResponsiveContainer } from '../../../components';
import { useBoundingRect } from '../../../core/hooks/useBoundingRect';
import Lists from '../../../favorites/components/Lists';

/**
 * The Tabs components
 * @returns {JSX}
 */
const Account = () => {
  const [value, setValue] = useState(0);
  const [box, ref] = useBoundingRect();
  return (
    <>
      <div ref={ref} className={tabs} style={{ top: box.top }}>
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

          {appConfig.hasFavorites ? (
            <Tab label="Wish List" />
          ) : null}
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
      {appConfig.hasFavorites ? (
        <TabPanel value={value} index={2}>
          <Lists />
        </TabPanel>
      ) : null}
    </>
  );
};

export default hot(Account);
