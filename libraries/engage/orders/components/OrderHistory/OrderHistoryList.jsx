import React from 'react';
import PropTypes from 'prop-types';
import { I18n, CardList, Link } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig, themeColors, themeName } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { getTranslatedOrderStatus } from '../../helpers';
import { getOrderDetailsRoute } from '../../helpers/orderDetails';

const { variables } = themeConfig;
const isIOS = themeName.includes('ios');

const useStyles = makeStyles()({
  orderNumber: {
    fontWeight: 500,
  },
  list: {
    background: 'var(--color-background-accent)',
    marginBottom: `-${variables.gap.small * 1.5}px`,
  },
  cardContent: {
    padding: variables.gap.big,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightAlign: {
    textAlign: 'right',
  },
  card: {
    marginBottom: variables.gap.small * 1.5,
    ':last-of-type': {
      marginBottom: 0,
    },
    background: themeColors.light,
    boxSizing: 'border-box',
    boxShadow: themeConfig.shadows.productCard,
    borderRadius: isIOS ? 10 : 2,
  },
});

/**
 * The Order History List Item component
 * @param {Object} props props
 * @returns {JSX}
 */
export const Row = (props) => {
  const { classes } = useStyles();

  return (
    <CardList.Item key={props.orderNumber} className={classes.card} onClick={props.openDetails}>
      <Link className={classes.cardContent} href={getOrderDetailsRoute(props.orderNumber)}>
        <div className={classes.column}>
          <span className={classes.orderNumber}>
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
        <div className={classes.column}>
          <span className={classes.rightAlign}>
            <I18n.Price
              currency={props.currencyCode}
              price={props.total}
            />
          </span>
          <span className={classes.rightAlign}>
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
};

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
export const List = ({ children }) => {
  const { classes } = useStyles();

  return (
    <CardList className={classes.list}>
      {children}
    </CardList>
  );
};

List.propTypes = {
  children: PropTypes.node.isRequired,
};
