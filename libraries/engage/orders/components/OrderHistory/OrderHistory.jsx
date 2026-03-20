import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { ResponsiveContainer, NoResults } from '@shopgate/engage/components';
import { Table, TableRow } from './OrderHistoryTable';
import { List, Row } from './OrderHistoryList';
import OrderHistoryLoader from './OrderHistoryLoader';
import { useOrderHistory } from '../../hooks';

const useStyles = makeStyles()({
  root: {
    margin: 8,
  },
  noResult: {
    margin: 16,
  },
});

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => {
  const { classes } = useStyles();
  const { totalOrderCount } = useOrderHistory();
  if (totalOrderCount === 0) {
    return (
      <div className={classes.noResult}>
        <NoResults
          headlineText="orders.no_result.body"
          bodyText=""
        />
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <OrderHistoryLoader wrapper={List} iterator={Row} />
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <OrderHistoryLoader wrapper={Table} iterator={TableRow} />
      </ResponsiveContainer>
    </div>
  );
};
export default OrderHistory;
