import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { OrderDetails as Content } from '@shopgate/engage/orders';

const { colors } = themeConfig;

/**
 * @returns {JSX}
 */
const OrderDetails = () => (
  <View background={colors.background} aria-hidden={false}>
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
