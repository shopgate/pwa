import { View } from '@shopgate/engage/components';
import React from 'react';
import { BackBar } from 'Components/AppBar/presets';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CookieConsentDetail } from '@shopgate/engage/cookie-consent/components';

const { colors } = themeConfig;

/**
 * The CookieConsentPage component.
 * @returns {JSX.Element}
 */
const CookieConsentPage = () => (
  <View aria-hidden={false} background={colors.background}>
    <BackBar />
    <CookieConsentDetail />
  </View>
);

export default CookieConsentPage;
