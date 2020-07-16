import React from 'react';
import PropTypes from 'prop-types';

import { i18n } from '@shopgate/engage/core';
import { getTranslatedOrderStatus } from '../../helpers';
import { useOrderDetails } from '../../hooks';
import {
  wrapper, instructions, body, orderNum, subline, cancel,
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

  const { orderNumber, status, statusText } = order;
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
