import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_STORE_INFORMATION_BEFORE,
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_AFTER,
} from '@shopgate/engage/core/constants';
import { hasNewServices, appSupportsCookieConsent } from '@shopgate/engage/core/helpers';
import { appConfig } from '@shopgate/engage';
import portalProps from '../../portalProps';
import Section from '../Section';
import Shipping from './components/Shipping';
import Payment from './components/Payment';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ReturnPolicy from './components/ReturnPolicy';
import Imprint from './components/Imprint';
import LegalPages from './components/LegalPages';
import PrivacySettings from './components/PrivacySettings';

const { cookieConsent: { isCookieConsentActivated } = {} } = appConfig;

/**
 * The StoreInfoComponent.
 * @returns {JSX}
 */
const StoreInfo = () => (
  <Fragment>
    <Portal name={NAV_MENU_STORE_INFORMATION_BEFORE} props={portalProps} />
    <Portal name={NAV_MENU_STORE_INFORMATION} props={portalProps}>
      <Section title="navigation.store_information">
        { !hasNewServices() && (
        <Fragment>
          <Shipping />
          <Payment />
        </Fragment>
        )}
        { hasNewServices() ? (
          <LegalPages />
        ) : (
          <Fragment>
            <Terms />
            <Privacy />
            {appSupportsCookieConsent() && isCookieConsentActivated && <PrivacySettings />}
            <ReturnPolicy />
            <Imprint />
          </Fragment>
        )}

      </Section>
    </Portal>
    <Portal name={NAV_MENU_STORE_INFORMATION_AFTER} props={portalProps} />
  </Fragment>
);

export default StoreInfo;
