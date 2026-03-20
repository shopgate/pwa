import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

import { i18n } from '@shopgate/engage/core';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import { getTranslatedOrderStatus } from '../../helpers';
import { useOrderDetails } from '../../hooks';
import { Button } from '../../../components';
import { ORDER_STATUS_SUBMITTED } from '../../constants';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  },
  instructions: {},
  body: {
    border: 0,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    marginBottom: 0,
  },
  orderNum: {
    padding: 0,
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: '1.5rem',
    margin: `0 0 ${variables.gap.big}px`,
    border: 0,
  },
  subline: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  cancel: {
    flexShrink: 0,
    marginRight: 8,
  },
  time: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 8,
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const OrderDetailsOrderHeader = ({ order }) => {
  const { classes } = useStyles();
  const { cancelOrder } = useOrderDetails();

  if (!order) {
    return null;
  }

  const {
    orderNumber, status, statusText, lineItems,
  } = order;
  const fulfillmentSlot = lineItems[0]?.fulfillmentSlot;

  /* eslint-disable react/no-danger */
  return (
    <div className={classes.wrapper}>
      <div className={classes.subline}>
        <p className={classes.orderNum}>
          {i18n.text('order_details.subline.order_number', { orderNumber })}
          {' | '}
          {i18n.text('order_details.subline.order_status', { status: getTranslatedOrderStatus(status) })}
        </p>
        { status === ORDER_STATUS_SUBMITTED && (
          <Button className={classes.cancel} type="secondary" onClick={cancelOrder} flat wrapContent={false}>
            {i18n.text('order_details.cancel.button')}
          </Button>
        )}
      </div>
      {fulfillmentSlot ? (
        <div className={classes.time}>
          <TimeIcon size={20} className={classes.timeIcon} />
          <span className={classes.subline}>
            {moment(fulfillmentSlot?.date, 'YYYY:MM-DD').format('LL')}
            {' '}
            {moment(fulfillmentSlot?.from, 'HH:mm').format('LT')}
            {' - '}
            {moment(fulfillmentSlot?.to, 'HH:mm').format('LT')}
          </span>
        </div>
      ) : null}
      { statusText && (
        <div className={classes.instructions}>
          <p className={classes.body} dangerouslySetInnerHTML={{ __html: statusText }} />
        </div>
      )}
    </div>
  );
  /* eslint-enable react/no-danger */
};

OrderDetailsOrderHeader.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default OrderDetailsOrderHeader;
