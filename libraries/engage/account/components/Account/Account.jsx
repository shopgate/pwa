import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { i18n, useRoute } from '@shopgate/engage/core';
import OrderHistory from '../../../orders/components/OrderHistory';
import OrderHistoryProvider from '../../../orders/providers/OrderHistoryProvider';
import { Tabs, Tab, TabPanel } from '../../../components/Tabs';
import { tabs, title, tabPanel } from './Account.style';
import { ResponsiveContainer } from '../../../components';
import Lists from '../../../favorites/components/Lists';
import connect from './Account.connector';
import { TabContext } from '../../../components/Tabs/TabContext';

/**
 * The Tabs components
 * @returns {JSX}
 */
const Account = ({ historyReplace }) => {
  const { params: { tab = 'orders' } } = useRoute();
  return (
    <>
      <TabContext value={tab}>
        <div
          className={tabs}
        >
          <ResponsiveContainer webOnly breakpoint=">xs">
            <div className={title}>
              <I18n.Text string="titles.your_account" />
            </div>
          </ResponsiveContainer>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newValue) => historyReplace({ pathname: `/account/${newValue}` })}
            aria-label="disabled tabs example"
          >
            <Tab value="orders" label={i18n.text('titles.order_history')} />

            {appConfig.hasFavorites ? (
              <Tab value="wish-list" label={i18n.text('titles.wish_list')} />
            ) : null}
          </Tabs>
        </div>
        <TabPanel className={tabPanel} value="orders">
          <OrderHistoryProvider>
            <OrderHistory />
          </OrderHistoryProvider>
        </TabPanel>
        {appConfig.hasFavorites ? (
          <TabPanel className={tabPanel} value="wish-list">
            <Lists />
          </TabPanel>
        ) : null}

      </TabContext>
    </>
  );
};

Account.propTypes = {
  historyReplace: PropTypes.func.isRequired,
};

export default hot(connect(Account));
