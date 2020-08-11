import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import Content from '@shopgate/engage/account/components/ProfileContact';

/**
 * @returns {JSX}
 */
const Account = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={
        <AppBar.Title title={i18n.text('titles.your_account_contact')} />
      }
    />
    <Content />
  </View>
);

export default Account;
