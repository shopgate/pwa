import React from 'react';
import PropTypes from 'prop-types';

import { i18n } from '@shopgate/engage/core';
import { getTranslatedOrderStatus } from '../../helpers';
import {
  wrapper, instructions, body, orderNum,
} from './OrderDetailsOrderHeader.style';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const OrderDetailsOrderHeader = ({ order }) => {
  if (!order) {
    return null;
  }

  const { orderNumber, status, statusText } = order;
  /* eslint-disable react/no-danger */
  return (
    <div className={wrapper}>
      <p className={orderNum}>
        {i18n.text('order_details.subline.order_number', { orderNumber })}
        {' | '}
        {i18n.text('order_details.subline.order_status', { status: getTranslatedOrderStatus(status) })}
      </p>
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
