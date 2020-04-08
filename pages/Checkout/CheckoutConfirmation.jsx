import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DefaultBar } from 'Components/AppBar/presets';
import { CheckoutConfirmation } from '@shopgate/engage/checkout';
import { i18n } from '@shopgate/engage/core';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const Checkout = () => (
  <View background={colors.background} aria-hidden={false}>
    <DefaultBar
      center={
        <AppBar.Title title={i18n.text('titles.checkout_confirmation')} />
      }
    />
    <CheckoutConfirmation />
  </View>
);

export default Checkout;

