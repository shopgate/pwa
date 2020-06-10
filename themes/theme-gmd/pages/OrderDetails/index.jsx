import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { OrderDetails as Content } from '@shopgate/engage/orders';

/**
 * @returns {JSX}
 */
const OrderDetails = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.order_details')} />
      }
    />
    <Content />
  </View>
);

export default OrderDetails;
