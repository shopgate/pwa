import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { i18n } from '@shopgate/engage/core';
import { getTranslatedOrderStatus } from '../../helpers';
import {
  tableHeader, tableRow, table,
} from './OrderHistoryTable.style';

/**
 * The Order History Table Row component
 * @param {Object} props props
 * @returns {JSX}
 */
export const TableRow = props => (
  <tr className={tableRow} onClick={() => {}}>
    <td>
      <I18n.Date
        timestamp={new Date(props.submitDate).getTime()}
        format="short"
      />
          &nbsp;
      <I18n.Time
        timestamp={new Date(props.submitDate).getTime()}
        format="short"
      />
    </td>
    <td>{props.orderNumber}</td>
    <td>{getTranslatedOrderStatus(props.status)}</td>
    <td align="right">
      <I18n.Number
        number={props.lineItemCount}
        fractions={0}
      />
    </td>
    <td align="right">
      <I18n.Price
        currency={props.currencyCode}
        price={props.total}
      />
    </td>
  </tr>
);

TableRow.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  lineItemCount: PropTypes.number.isRequired,
  orderNumber: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  submitDate: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

/**
 * The Order History Table component
 * @param {Object} props props
 * @returns {JSX}
 */
export const Table = ({ children }) => (
  <div className={table}>
    <table>
      <thead className={tableHeader}>
        <td>{i18n.text('orders.header.date')}</td>
        <td>{i18n.text('orders.header.orderNumber')}</td>
        <td>{i18n.text('orders.header.status')}</td>
        <td align="right">{i18n.text('orders.header.lineItemCount')}</td>
        <td align="right">{i18n.text('orders.header.total')}</td>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

