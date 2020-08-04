import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import { Account as Content } from '@shopgate/engage/account';

/**
 * @returns {JSX}
 */
const Account = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.your_account')} />
      }
    />
    <Content />
  </View>
);

export default Account;
