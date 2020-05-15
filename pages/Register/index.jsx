import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { Registration } from '@shopgate/engage/registration';

/**
 * The Cart component.
 * @returns {JSX}
 */
const RegisterPage = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.register')} />
      }
    />
    <Registration />
  </View>
);

export default RegisterPage;
