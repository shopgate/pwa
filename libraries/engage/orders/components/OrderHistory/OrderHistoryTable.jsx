import React from 'react';
import { hot } from 'react-hot-loader/root';
import I18n from '@shopgate/pwa-common/components/I18n';
import { getTranslatedOrderStatus } from '../../helpers';
import { useOrderHistory } from '../../hooks';
import {
  tableHeader, tableRow, table,
} from './OrderHistoryTable.style';

/**
 * The OrderDetails components
 * @returns {JSX}
 */
const OrderHistory = () => {
  const { orders, openDetails } = useOrderHistory();
  return (
    <div className={table}>
      <table>
        <thead className={tableHeader}>
          <td>Order Date</td>
          <td>Order Number</td>
          <td>Status</td>
          <td align="right">Number of Items</td>
          <td align="right">Order Total</td>
        </thead>
        <tbody>
          { orders.map(order => (
            <tr className={tableRow} onClick={() => openDetails(order.orderNumber)}>
              <td>
                <I18n.Date
                  timestamp={new Date(order.submitDate).getTime()}
                  format="short"
                />
                  &nbsp;
                <I18n.Time
                  timestamp={new Date(order.submitDate).getTime()}
                  format="short"
                />
              </td>
              <td>{order.orderNumber}</td>
              <td>{getTranslatedOrderStatus(order.status)}</td>
              <td align="right">
                <I18n.Number
                  number={order.lineItemCount}
                  fractions={0}
                />
              </td>
              <td align="right">
                <I18n.Price
                  currency={order.currencyCode}
                  price={order.total}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default hot(OrderHistory);
