import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { GuestRegistration } from '@shopgate/engage/checkout';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const GuestCheckoutPage = () => (
  <View background={colors.background} aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.checkout')} />
      }
    />
    <GuestRegistration />
  </View>
);

export default GuestCheckoutPage;
