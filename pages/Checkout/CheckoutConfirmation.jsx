import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DefaultBar } from 'Components/AppBar/presets';
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
  </View>
);

export default Checkout;

