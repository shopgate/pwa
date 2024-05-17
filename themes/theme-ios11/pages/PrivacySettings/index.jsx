import { View } from '@shopgate/engage/components';
import React from 'react';
import { BackBar } from 'Components/AppBar/presets';
import { PrivacySettings } from '@shopgate/engage/tracking/components';

/**
 * The CookieConsentPage component.
 * @returns {JSX.Element}
 */
const PrivacySettingsPage = () => (
  <View aria-hidden={false}>
    <BackBar />
    <PrivacySettings />
  </View>
);

export default PrivacySettingsPage;
