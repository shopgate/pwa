import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Table, TableRow } from './OrderHistoryTable';
import { List, Row } from './OrderHistoryList';
import { ResponsiveContainer } from '../../../components';
import OrderHistoryLoader from './OrderHistoryLoader';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => (
  <div>
    <ResponsiveContainer appAlways breakpoint="<=xs">
      <OrderHistoryLoader wrapper={List} iterator={Row} />
    </ResponsiveContainer>
    <ResponsiveContainer webOnly breakpoint=">xs">
      <OrderHistoryLoader wrapper={Table} iterator={TableRow} />
    </ResponsiveContainer>
  </div>
);
export default hot(OrderHistory);
