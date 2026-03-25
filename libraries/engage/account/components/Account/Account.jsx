import React from 'react';
import PropTypes from 'prop-types';
import { I18n, ResponsiveContainer } from '@shopgate/engage/components';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { i18n, useRoute } from '@shopgate/engage/core';
import OrderHistory from '../../../orders/components/OrderHistory';
import OrderHistoryProvider from '../../../orders/providers/OrderHistoryProvider';
import { Tabs, Tab, TabPanel } from '../../../components/Tabs';
import Lists from '../../../favorites/components/Lists';
import connect from './Account.connector';
import { TabContext } from '../../../components/Tabs/TabContext';
import Profile from '../Profile';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  title: {
    fontSize: '1.5rem',
    padding: variables.gap.big,
  },
  tabs: {
    width: '100%',
    top: 0,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      top: 64,
    },
    [responsiveMediaQuery('<=xs', { webOnly: true })]: {
      top: 56,
    },
    position: 'sticky',
    background: 'rgb(255, 255, 255)',
    boxShadow: '2px 1px 6px rgba(0, 0, 0, 0.118), 2px 1px 4px rgba(0, 0, 0, 0.118)',
    zIndex: 100,
  },
  tabPanel: {
    padding: variables.gap.small,
  },
});

/**
 * The Tabs components
 * @returns {JSX}
 */
const Account = ({ historyReplace }) => {
  const { classes } = useStyles();
  const { params: { tab = 'profile' } } = useRoute();
  return (
    <TabContext value={tab}>
      <div
        className={classes.tabs}
      >
        <ResponsiveContainer webOnly breakpoint=">xs">
          <div className={classes.title}>
            <I18n.Text string="titles.your_account" />
          </div>
        </ResponsiveContainer>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => historyReplace({ pathname: `/account/${newValue}` })}
          aria-label="disabled tabs example"
        >
          <Tab value="profile" label={i18n.text('titles.profile')} />

          <Tab value="orders" label={i18n.text('titles.order_history')} />

          {appConfig.hasFavorites ? (
            <Tab value="wish-list" label={i18n.text('titles.favorites')} />
          ) : null}
        </Tabs>
      </div>
      <TabPanel className={classes.tabPanel} value="profile">
        <Profile />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value="orders">
        <OrderHistoryProvider>
          <OrderHistory />
        </OrderHistoryProvider>
      </TabPanel>
      {appConfig.hasFavorites ? (
        <TabPanel className={classes.tabPanel} value="wish-list">
          <Lists />
        </TabPanel>
      ) : null}

    </TabContext>
  );
};

Account.propTypes = {
  historyReplace: PropTypes.func.isRequired,
};

export default connect(Account);
