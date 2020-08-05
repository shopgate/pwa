import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { i18n } from '@shopgate/engage/core';
import { getTranslatedOrderStatus } from '../../helpers';
import {
  tableHeader, tableRow, root,
} from './OrderHistoryTable.style';
import { Card } from '../../../components';

/**
 * The Order History Table Row component
 * @param {Object} props props
 * @returns {JSX}
 */
export const TableRow = props => (
  <tr key={props.orderNumber} className={tableRow} onClick={props.openDetails}>
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
  openDetails: PropTypes.func.isRequired,
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
  <div className={root}>
    <Card>
      <table>
        <thead>
          <tr className={tableHeader}>
            <th align="left">{i18n.text('orders.header.date')}</th>
            <th align="left">{i18n.text('orders.header.orderNumber')}</th>
            <th align="left">{i18n.text('orders.header.status')}</th>
            <th align="right">{i18n.text('orders.header.lineItemCount')}</th>
            <th align="right">{i18n.text('orders.header.total')}</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </Card>
  </div>
);

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

