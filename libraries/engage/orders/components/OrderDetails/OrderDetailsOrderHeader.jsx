import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

import { i18n } from '@shopgate/engage/core/helpers';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import { getTranslatedOrderStatus } from '../../helpers';
import { useOrderDetails } from '../../hooks';
import { Button } from '../../../components';
import { ORDER_STATUS_SUBMITTED } from '../../constants';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    padding: theme.spacing(2, 2, 0),
  },
  instructions: {},
  body: {
    border: 0,
    lineHeight: '1.25rem',
    marginBottom: 0,
  },
  orderNum: {
    padding: 0,
    lineHeight: '1.5rem',
    margin: theme.spacing(0, 0, 2),
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
}));

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

  return (
    <div className={classes.wrapper}>
      <div className={classes.subline}>
        <Typography variant="h3" component="p" className={classes.orderNum}>
          {i18n.text('order_details.subline.order_number', { orderNumber })}
          {' | '}
          {i18n.text('order_details.subline.order_status', { status: getTranslatedOrderStatus(status) })}
        </Typography>
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
          <Typography variant="body2" component="p" className={classes.body} dangerouslySetInnerHTML={{ __html: statusText }} />
        </div>
      )}
    </div>
  );
};

OrderDetailsOrderHeader.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default OrderDetailsOrderHeader;
