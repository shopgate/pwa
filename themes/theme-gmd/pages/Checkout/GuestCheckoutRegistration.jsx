import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-material';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { GuestRegistration } from '@shopgate/engage/registration/components';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const GuestCheckoutRegistrationPage = () => (
  <View background={colors.light} aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.checkout')} />
      }
    />
    <GuestRegistration />
  </View>
);

export default GuestCheckoutRegistrationPage;
