import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { GuestCheckoutPayment } from '@shopgate/engage/checkout/components';

/**
 * The Cart component.
 * @returns {JSX}
 */
const GuestCheckoutPaymentPage = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.checkout')} />
      }
    />
    <GuestCheckoutPayment />
  </View>
);

export default GuestCheckoutPaymentPage;
