import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Table, TableRow } from './OrderHistoryTable';
import { List, Row } from './OrderHistoryList';
import { ResponsiveContainer, NoResults } from '../../../components';
import OrderHistoryLoader from './OrderHistoryLoader';
import { useOrderHistory } from '../../hooks';
import { root } from './OrderHistory.style';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => {
  const { totalOrderCount } = useOrderHistory();
  if (totalOrderCount === 0) {
    return (
      <div className={root}>
        <NoResults
          headlineText="orders.no_result.body"
          bodyText=""
        />
      </div>
    );
  }
  return (
    <div className={root}>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <OrderHistoryLoader wrapper={List} iterator={Row} />
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <OrderHistoryLoader wrapper={Table} iterator={TableRow} />
      </ResponsiveContainer>
    </div>
  );
};
export default hot(OrderHistory);
