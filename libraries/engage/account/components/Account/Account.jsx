import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core';
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
const Account = ({ tabsStyle }) => {
  const [value, setValue] = useState(0);
  const [box, ref] = useBoundingRect();
  return (
    <div ref={ref}>
      <div
        className={tabs}
        style={{
          top: box.top,
          ...tabsStyle,
        }}
      >
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
          <Tab label={i18n.text('titles.profile')} />
          <Tab label={i18n.text('titles.order_history')} />

          {appConfig.hasFavorites ? (
            <Tab label={i18n.text('titles.wish_list')} />
          ) : null}
        </Tabs>
      </div>
      <TabPanel value={value} index={0} />
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
    </div>
  );
};

Account.propTypes = {
  tabsStyle: PropTypes.shape(),
};

Account.defaultProps = {
  tabsStyle: null,
};

export default hot(Account);
