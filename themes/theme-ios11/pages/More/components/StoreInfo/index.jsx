import React, { Fragment } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_MENU_STORE_INFORMATION_BEFORE,
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_AFTER,
} from '@shopgate/engage/core';
import { appConfig } from '@shopgate/engage';
import portalProps from '../../portalProps';
import Section from '../Section';
import Shipping from './components/Shipping';
import Payment from './components/Payment';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ReturnPolicy from './components/ReturnPolicy';
import Imprint from './components/Imprint';
import PrivacySettings from './components/PrivacySettings';

/**
 * The StoreInfoComponent.
 * @returns {JSX.Element}
 */
const StoreInfo = () => {
  const { cookieConsent: { cookieConsentActivated } } = appConfig;

  return (
    <Fragment>
      <Portal name={NAV_MENU_STORE_INFORMATION_BEFORE} props={portalProps} />
      <Portal name={NAV_MENU_STORE_INFORMATION} props={portalProps}>
        <Section title="navigation.store_information">
          <Shipping />
          <Payment />
          <Terms />
          <Privacy />
          {cookieConsentActivated && <PrivacySettings />}
          <ReturnPolicy />
          <Imprint />
        </Section>
      </Portal>
      <Portal name={NAV_MENU_STORE_INFORMATION_AFTER} props={portalProps} />
    </Fragment>
  );
};

export default StoreInfo;
