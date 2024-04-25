import { View } from '@shopgate/engage/components';
import React from 'react';
import { BackBar } from 'Components/AppBar/presets';
import { PrivacySettings } from '@shopgate/engage/tracking/components';

/**
 * The CookieConsentPage component.
 * @returns {JSX.Element}
 */
const CookieConsentPage = () => (
  <View aria-hidden={false}>
    <BackBar right={null} />
    <PrivacySettings />
  </View>
);

export default CookieConsentPage;
