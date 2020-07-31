import React from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import Table from './OrderHistoryTable';
import {
  root, title,
} from './OrderHistory.style';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => (
  <div className={root}>
    <div className={title}>
      <I18n.Text string="titles.order_history" />
    </div>
    <Table />
  </div>
);

export default hot(OrderHistory);
