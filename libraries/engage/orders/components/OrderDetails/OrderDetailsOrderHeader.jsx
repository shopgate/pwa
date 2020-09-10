import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { i18n } from '@shopgate/engage/core';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import { getTranslatedOrderStatus } from '../../helpers';
import { useOrderDetails } from '../../hooks';
import {
  wrapper, instructions, body, orderNum, subline, cancel, time, timeIcon,
} from './OrderDetailsOrderHeader.style';
import { Button } from '../../../components';
import { ORDER_STATUS_SUBMITTED } from '../../constants';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const OrderDetailsOrderHeader = ({ order }) => {
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
    <div className={wrapper}>
      <div className={subline}>
        <p className={orderNum}>
          {i18n.text('order_details.subline.order_number', { orderNumber })}
          {' | '}
          {i18n.text('order_details.subline.order_status', { status: getTranslatedOrderStatus(status) })}
        </p>
        { status === ORDER_STATUS_SUBMITTED && (
          <Button className={cancel} type="secondary" onClick={cancelOrder} flat wrapContent={false}>
            {i18n.text('order_details.cancel.button')}
          </Button>
        )}
      </div>
      {fulfillmentSlot ? (
        <div className={time}>
          <TimeIcon size={20} className={timeIcon} />
          <span className={subline}>
            {moment(fulfillmentSlot?.date, 'YYYY:MM-DD').format('LL')}
            {' '}
            {moment(fulfillmentSlot?.from, 'HH:mm').format('LT')}
            {' - '}
            {moment(fulfillmentSlot?.to, 'HH:mm').format('LT')}
          </span>
        </div>
      ) : null}
      { statusText && (
        <div className={instructions}>
          <p className={body} dangerouslySetInnerHTML={{ __html: statusText }} />
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
