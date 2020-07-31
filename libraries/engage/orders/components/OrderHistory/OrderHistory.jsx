import React from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import { Table, TableRow } from './OrderHistoryTable';
import { List, Row } from './OrderHistoryList';
import { title } from './OrderHistory.style';
import { ResponsiveContainer } from '../../../components';
import OrderHistoryLoader from './OrderHistoryLoader';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => (
  <div>
    <div className={title}>
      <I18n.Text string="titles.order_history" />
    </div>
    <ResponsiveContainer appAlways breakpoint="<=xs">
      <OrderHistoryLoader wrapper={List} iterator={Row} />
    </ResponsiveContainer>
    <ResponsiveContainer webOnly breakpoint=">xs">
      <OrderHistoryLoader wrapper={Table} iterator={TableRow} />
    </ResponsiveContainer>
  </div>
);
export default hot(OrderHistory);
