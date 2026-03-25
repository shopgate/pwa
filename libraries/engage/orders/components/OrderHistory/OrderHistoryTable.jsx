import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { Card } from '@shopgate/engage/components';
import { getTranslatedOrderStatus } from '../../helpers';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  tableHeader: {
    '& > th': {
      padding: variables.gap.big,
      fontWeight: 500,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  tableRow: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.04)',
    },
    '& > td': {
      padding: variables.gap.big,
    },
  },
});

/**
 * The Order History Table Row component
 * @param {Object} props props
 * @returns {JSX}
 */
export const TableRow = (props) => {
  const { classes } = useStyles();

  return (
    <tr key={props.orderNumber} className={classes.tableRow} onClick={props.openDetails}>
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
};

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
export const Table = ({ children }) => {
  const { classes } = useStyles();

  return (
    <Card>
      <table>
        <thead>
          <tr className={classes.tableHeader}>
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
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

