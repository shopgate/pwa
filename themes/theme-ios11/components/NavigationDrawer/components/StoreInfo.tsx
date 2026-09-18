import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import { hasNewServices, appSupportsCookieConsent } from '@shopgate/engage/core/helpers';
import {
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_MORE,
  NAV_MENU_STORE_INFORMATION_ABOUT,
} from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Section from './Section';
import ShippingButton from './buttons/ShippingButton';
import PaymentButton from './buttons/PaymentButton';
import LegalButtons from './buttons/LegalButtons';
import TermsButton from './buttons/TermsButton';
import PrivacyButton from './buttons/PrivacyButton';
import PrivacySettingsButton from './buttons/PrivacySettingsButton';
import ReturnsButton from './buttons/ReturnsButton';
import ImprintButton from './buttons/ImprintButton';
import portalProps from '../portalProps';

const { cookieConsent: { isCookieConsentActivated = false } = {} } =
  appConfig as { cookieConsent?: { isCookieConsentActivated?: boolean } };

/**
 * Renders the store information sections of the navigation drawer.
 * @returns The rendered sections.
 */
const StoreInfo = () => (
  <SurroundPortals portalName={NAV_MENU_STORE_INFORMATION} portalProps={portalProps}>
    <SurroundPortals portalName={NAV_MENU_STORE_INFORMATION_MORE} portalProps={portalProps}>
      {!hasNewServices() && (
        <Section title="navigation.menuSubHeader.more">
          <ShippingButton />
          <PaymentButton />
        </Section>
      )}
    </SurroundPortals>
    <SurroundPortals portalName={NAV_MENU_STORE_INFORMATION_ABOUT} portalProps={portalProps}>
      <Section title="navigation.menuSubHeader.about">
        {hasNewServices() ? (
          <LegalButtons />
        ) : (
          <>
            <TermsButton />
            <PrivacyButton />
            {appSupportsCookieConsent() && isCookieConsentActivated && <PrivacySettingsButton />}
            {showReturnPolicy && <ReturnsButton />}
            <ImprintButton />
          </>
        )}
      </Section>
    </SurroundPortals>
  </SurroundPortals>
);

export default StoreInfo;
