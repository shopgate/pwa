import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { CheckoutBillingChange } from '@shopgate/engage/checkout';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const CheckoutBillingPage = () => (
  <View background={colors.background} aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.checkout_change_billing')} />
      }
    />
    <CheckoutBillingChange />
  </View>
);

export default CheckoutBillingPage;
