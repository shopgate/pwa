import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { i18n } from '@shopgate/engage/core';
import { getTranslatedOrderStatus } from '../../helpers';
import {
  card,
  list,
  orderNumber,
  column,
  rightAlign,
  cardContent,
} from './OrderHistoryList.style';
import { CardList, Link } from '../../../components';
import { getOrderDetailsRoute } from '../../helpers/orderDetails';

/**
 * The Order History List Item component
 * @param {Object} props props
 * @returns {JSX}
 */
export const Row = props => (
  <CardList.Item key={props.orderNumber} className={card} onClick={props.openDetails}>
    <Link className={cardContent} href={getOrderDetailsRoute(props.orderNumber)}>
      <div className={column}>
        <span className={orderNumber}>
          {i18n.text('orders.header.orderNumber')}
            :&nbsp;
          {props.orderNumber}
        </span>
        <span>
          <I18n.Date
            timestamp={new Date(props.submitDate).getTime()}
            format="short"
          />
                &nbsp;
          <I18n.Time
            timestamp={new Date(props.submitDate).getTime()}
            format="short"
          />
        </span>
        <span>
          {i18n.text('orders.header.status')}
            :&nbsp;
          {getTranslatedOrderStatus(props.status)}
        </span>
      </div>
      <div className={column}>
        <span className={rightAlign}>
          <I18n.Price
            currency={props.currencyCode}
            price={props.total}
          />
        </span>
        <span className={rightAlign}>
          <I18n.Number
            number={props.lineItemCount}
            fractions={0}
          />
            &nbsp;
          {i18n.text('orders.itemCount', { count: props.lineItemCount })}
        </span>
      </div>
    </Link>
  </CardList.Item>
);

Row.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  lineItemCount: PropTypes.number.isRequired,
  openDetails: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  submitDate: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

/**
 * The Order History List component
 * @param {Object} props props
 * @returns {JSX}
 */
export const List = ({ children }) => (
  <CardList className={list}>
    {children}
  </CardList>
);

List.propTypes = {
  children: PropTypes.node.isRequired,
};
