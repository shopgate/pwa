import React, { Fragment } from 'react';
import { I18n } from '@shopgate/engage/components';
import { useOrderDetails } from '../../hooks';
import OrderDetailsOrder from './OrderDetailsOrder';
import OrderDetailsAuthenticate from './OrderDetailsAuthenticate';
import { headline } from './OrderDetailsContent.style';

/**
 * @returns {JSX}
 */
const OrderDetailsContent = () => {
  const {
    errorMessage,
    showForm,
    order,
  } = useOrderDetails();

  return (
    <>
      { (showForm || order || errorMessage) && (
        <div className={headline}>
          <I18n.Text string="titles.order_details" />
        </div>
      )}
      <OrderDetailsAuthenticate />
      <OrderDetailsOrder />
    </>
  );
};

export default OrderDetailsContent;
