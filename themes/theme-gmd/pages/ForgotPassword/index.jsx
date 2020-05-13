import React from 'react';
import { View } from '@shopgate/engage/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ForgotPassword as Content } from '@shopgate/engage/login';
import { BackBar } from 'Components/AppBar/presets';

/**
 * @returns {JSX}
 */
const ForgotPassword = () => (
  <View aria-hidden={false}>
    <BackBar
      right={null}
      center={<AppBar.Title title="" />}
    />
    <Content />
  </View>
);

export default ForgotPassword;
